import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { Category } from '@prisma/client';
import { CategoryDto } from './category.dto';
import { CategoryHelper } from './category.helper';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ELang, ERecordStatus } from 'src/common/enum/base';
import utils from 'src/utils';

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
    private categoryHelper: CategoryHelper,
  ) {}

  private queryFilter = (cateStatus: ERecordStatus) => [
    { isDelete: { equals: false } },
    cateStatus
      ? Number(cateStatus) !== ERecordStatus.ALL
        ? { status: Number(cateStatus) }
        : {}
      : { status: ERecordStatus.ACTIVE },
  ];

  async getCategories(query: QueryDto) {
    const { keywords, sortBy, langCode, hasSub, cateStatus } = query;
    const categories = await this.prisma.category.findMany({
      where: { AND: this.queryFilter(cateStatus) },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      select: { ...this.categoryHelper.getSelectFields(langCode, { hasSub, convertLang: true }) },
    });
    let filterCategories: Category[] = [];
    if (keywords)
      filterCategories = categories.filter((category) =>
        langCode === ELang.EN
          ? utils.filterByKeywords(category.nameEn, keywords)
          : utils.filterByKeywords(category.nameVn, keywords),
      );
    const items = this.categoryHelper.convertCollection(keywords ? filterCategories : categories, langCode);
    return { totalItems: keywords ? filterCategories.length : categories.length, items };
  }

  async getCategoriesPaging(query: QueryDto) {
    const { page, limit, keywords, sortBy, langCode, hasSub, cateStatus } = query;
    let collection: Paging<Category> = utils.defaultCollection();
    const categories = await this.prisma.category.findMany({
      where: { AND: this.queryFilter(cateStatus) },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      select: { ...this.categoryHelper.getSelectFields(langCode, { hasSub, convertLang: true }) },
    });
    if (keywords) {
      const filterCategories = categories.filter((category) =>
        langCode === ELang.EN
          ? utils.filterByKeywords(category.nameEn, keywords)
          : utils.filterByKeywords(category.nameVn, keywords),
      );
      collection = utils.paging<Category>(filterCategories, page, limit);
    } else collection = utils.paging<Category>(categories, page, limit);
    const items = this.categoryHelper.convertCollection(collection.items, langCode);
    return { ...collection, items };
  }

  async getCategory(query: QueryDto) {
    const { categoryId, langCode, hasSub, convertLang } = query;
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId, isDelete: false },
      select: { ...this.categoryHelper.getSelectFields(langCode, { hasSub, convertLang }) },
    });
    const convertResponse = utils.convertRecordsName<Category>({ ...category }, langCode);
    return convertLang ? convertResponse : category;
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
    throw new HttpException('Create failed', HttpStatus.BAD_REQUEST);
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
      select: { ...this.categoryHelper.getSelectFields(ELang.EN, {}) },
    });
    if (categories && !categories.length) throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    await this.prisma.category.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    await Promise.all(
      categories.map(async (category) => {
        if (category.image) await this.categoryHelper.handleUpdateIsDeleteCategoryImage(category, true);
        if (category.subCategories.length > 0)
          await this.categoryHelper.handleUpdateIsDeleteSubCategories(category, true);
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
      select: { ...this.categoryHelper.getSelectFields(ELang.EN, {}) },
    });
    if (categories && !categories.length)
      throw new HttpException('There are no data to restored', HttpStatus.OK);
    await Promise.all(
      categories.map(async (category) => {
        await this.categoryHelper.handleRestoreCategory(category);
        if (category.image) await this.categoryHelper.handleUpdateIsDeleteCategoryImage(category, false);
        if (category.subCategories.length > 0)
          await this.categoryHelper.handleUpdateIsDeleteSubCategories(category, false);
      }),
    );
    throw new HttpException('Restored success', HttpStatus.OK);
  }
}
