import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging, SelectFieldsOptions } from 'src/common/type/base';
import { Category, SubCategory } from '@prisma/client';
import { CategoryDto } from './category.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ELang, ERecordStatus } from 'src/common/enum/base';
import utils from 'src/utils';

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  private getSelectFields(langCode: ELang, options: SelectFieldsOptions) {
    return {
      id: true,
      image: true,
      nameVn: options.convertName ? langCode === ELang.VN : true,
      nameEn: options.convertName ? langCode === ELang.EN : true,
      status: true,
      isDelete: true,
      createdAt: true,
      updatedAt: true,
      subCategories: options.hasSub
        ? {
            select: {
              id: true,
              image: true,
              nameVn: options.convertName ? langCode === ELang.VN : true,
              nameEn: options.convertName ? langCode === ELang.EN : true,
              status: true,
              isDelete: true,
              createdAt: true,
              updatedAt: true,
            },
          }
        : false,
    };
  }

  private convertCollection(categories: Category[], langCode: ELang) {
    return categories.map((category) => ({
      ...utils.convertRecordsName<Category>(category, langCode),
      subCategories:
        'subCategories' in category
          ? (category.subCategories as SubCategory[])?.map((subCategory) => ({
              ...utils.convertRecordsName<SubCategory>(subCategory, langCode),
            }))
          : null,
    }));
  }

  async getCategories(query: QueryDto) {
    const { keywords, sortBy, langCode, hasSub, cateStatus } = query;
    const categories = await this.prisma.category.findMany({
      where: {
        AND: [
          { isDelete: { equals: false } },
          cateStatus
            ? Number(cateStatus) !== ERecordStatus.ALL
              ? { status: Number(cateStatus) }
              : {}
            : { status: ERecordStatus.ACTIVE },
        ],
      },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      select: { ...this.getSelectFields(langCode, { hasSub, convertName: true }) },
    });
    let filterCategories: Category[] = [];
    if (keywords)
      filterCategories = categories.filter((category) =>
        langCode === ELang.EN
          ? category.nameEn.toLowerCase().includes(keywords.toLowerCase())
          : category.nameVn.toLowerCase().includes(keywords.toLowerCase()),
      );
    const items = this.convertCollection(keywords ? filterCategories : categories, langCode);
    return { totalItems: keywords ? filterCategories.length : categories.length, items };
  }

  async getCategoriesPaging(query: QueryDto) {
    const { page, limit, keywords, sortBy, langCode, hasSub, cateStatus } = query;
    let collection: Paging<Category> = utils.defaultCollection();
    const categories = await this.prisma.category.findMany({
      where: {
        AND: [
          { isDelete: { equals: false } },
          cateStatus
            ? Number(cateStatus) !== ERecordStatus.ALL
              ? { status: Number(cateStatus) }
              : {}
            : { status: ERecordStatus.ACTIVE },
        ],
      },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      select: { ...this.getSelectFields(langCode, { hasSub, convertName: true }) },
    });
    if (keywords) {
      const filterCategories = categories.filter((category) =>
        langCode === ELang.EN
          ? category.nameEn.toLowerCase().includes(keywords.toLowerCase())
          : category.nameVn.toLowerCase().includes(keywords.toLowerCase()),
      );
      collection = utils.paging<Category>(filterCategories, page, limit);
    } else collection = utils.paging<Category>(categories, page, limit);
    const items = this.convertCollection(collection.items, langCode);
    return { ...collection, items };
  }

  async getCategory(query: QueryDto) {
    const { categoryId, langCode, hasSub, convertName } = query;
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId, isDelete: false },
      select: { ...this.getSelectFields(langCode, { hasSub, convertName }) },
    });
    const convertResponse = utils.convertRecordsName<Category>({ ...category }, langCode);
    return convertName ? convertResponse : category;
  }

  async createCategory(file: Express.Multer.File, category: CategoryDto) {
    const { nameEn, nameVn, status } = category;
    const newCategory = await this.prisma.category.create({
      data: { nameEn, nameVn, status: Number(status), isDelete: false },
    });
    if (newCategory) {
      if (!file) return newCategory;
      const result = await this.cloudinary.upload(utils.getFileUrl(file));
      const image = utils.generateImage(result, { categoryId: newCategory.id });
      await this.prisma.image.create({ data: { ...image, isDelete: false } });
      const resCategory = await this.prisma.category.findUnique({
        where: { id: newCategory.id },
        include: { image: true },
      });
      return resCategory;
    }
    throw new HttpException('Create failed', HttpStatus.BAD_REQUEST)
  }

  async updateCategory(query: QueryDto, file: Express.Multer.File, category: CategoryDto) {
    const { categoryId } = query;
    const { nameEn, nameVn, status } = category;
    await this.prisma.category.update({
      where: { id: categoryId },
      data: { nameEn, nameVn, status: Number(status) },
    });
    if (file) {
      const updateCategory = await this.prisma.category.findUnique({
        where: { id: categoryId },
        select: { image: true },
      });
      const result = await this.cloudinary.upload(utils.getFileUrl(file));
      const image = utils.generateImage(result, { categoryId });
      if (updateCategory && updateCategory.image) {
        await this.cloudinary.destroy(updateCategory.image.publicId);
        await this.prisma.image.update({ where: { categoryId }, data: image });
      } else {
        await this.prisma.image.create({ data: { ...image, isDelete: false } });
      }
    }
    throw new HttpException('Updated success', HttpStatus.OK);
  }

  async removeCategories(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const categories = await this.prisma.category.findMany({
      where: { id: { in: listIds } },
      select: { id: true, image: true, subCategories: true },
    });
    if (categories && !categories.length) throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    await this.prisma.category.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    await Promise.all(
      categories.map(async (category) => {
        if (!category.image)
          await this.prisma.image.update({ where: { categoryId: category.id }, data: { isDelete: true } });
        if (category.subCategories.length > 0)
          await this.prisma.subCategory.updateMany({
            where: { categoryId: category.id },
            data: { isDelete: true },
          });
      }),
    );
    throw new HttpException('Removed success', HttpStatus.OK);
  }

  async removeCategoriesPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const categories = await this.prisma.category.findMany({
      where: { id: { in: listIds } },
      include: { image: true },
    });
    if (categories && !categories.length) throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    await this.prisma.category.deleteMany({ where: { id: { in: listIds } } });
    await Promise.all(
      categories.map(async (category) => {
        if (!category.image) return;
        await this.cloudinary.destroy(category.image.publicId);
      }),
    );
    throw new HttpException('Removed success', HttpStatus.OK);
  }

  async restoreCategories() {
    const categories = await this.prisma.category.findMany({
      where: { isDelete: { equals: true } },
      select: { id: true, image: true, subCategories: true },
    });
    if (categories && !categories.length)
      throw new HttpException('There are no data to restored', HttpStatus.OK);
    await Promise.all(
      categories.map(async (category) => {
        await this.prisma.category.update({ where: { id: category.id }, data: { isDelete: false } });
        if (category.image)
          await this.prisma.image.update({ where: { categoryId: category.id }, data: { isDelete: false } });
        if (category.subCategories.length > 0)
          await this.prisma.subCategory.updateMany({
            where: { categoryId: category.id },
            data: { isDelete: false },
          });
      }),
    );
    throw new HttpException('Restored success', HttpStatus.OK);
  }
}
