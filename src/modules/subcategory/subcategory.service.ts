import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging, SelectFieldsOptions } from 'src/common/type/base';
import { Category, SubCategory } from '@prisma/client';
import { SubCategoryDto } from './subcategory.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ELang, ERecordStatus } from 'src/common/enum/base';
import utils from 'src/utils';

@Injectable()
export class SubCategoryService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  private getSelectFields(langCode: ELang, options?: SelectFieldsOptions) {
    return {
      id: true,
      image: true,
      nameVn: options?.convertName ? langCode === ELang.VN : true,
      nameEn: options?.convertName ? langCode === ELang.EN : true,
      categoryId: true,
      status: true,
      isDelete: true,
      createdAt: true,
      updatedAt: true,
      category: options?.hasCate
        ? {
            select: {
              id: true,
              nameVn: options?.convertName ? langCode === ELang.VN : true,
              nameEn: options?.convertName ? langCode === ELang.EN : true,
            },
          }
        : false,
    };
  }

  private convertCollection(subCategories: SubCategory[], langCode: ELang) {
    return subCategories.map((subCategory) => ({
      ...utils.convertRecordsName<SubCategory>(subCategory, langCode),
      category:
        'category' in subCategory
          ? { ...utils.convertRecordsName<Category>(subCategory.category as Category, langCode) }
          : null,
    }));
  }

  async getSubCategories(query: QueryDto) {
    const { keywords, sortBy, categoryId, langCode, hasCate, subCateStatus } = query;
    const subCategories = await this.prisma.subCategory.findMany({
      where: {
        AND: [
          { categoryId },
          { isDelete: { equals: false } },
          subCateStatus
            ? Number(subCateStatus) !== ERecordStatus.ALL
              ? { status: Number(subCateStatus) }
              : {}
            : { status: ERecordStatus.ACTIVE },
        ],
      },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      select: { ...this.getSelectFields(langCode, { hasCate }) },
    });
    let filterSubCategories: SubCategory[] = [];
    if (keywords)
      filterSubCategories = subCategories.filter((subCategory) =>
        langCode === ELang.EN
          ? subCategory.nameEn.toLowerCase().includes(keywords.toLowerCase())
          : subCategory.nameVn.toLowerCase().includes(keywords.toLowerCase()),
      );
    const items = this.convertCollection(keywords ? filterSubCategories : subCategories, langCode);
    return { totalItems: keywords ? filterSubCategories.length : subCategories.length, items };
  }

  async getSubCategoriesPaging(query: QueryDto) {
    const { page, limit, keywords, sortBy, categoryId, langCode, subCateStatus } = query;
    let collection: Paging<SubCategory> = utils.defaultCollection();
    const subCategories = await this.prisma.subCategory.findMany({
      where: {
        AND: [
          { categoryId },
          { isDelete: { equals: false } },
          subCateStatus
            ? Number(subCateStatus) !== ERecordStatus.ALL
              ? { status: Number(subCateStatus) }
              : {}
            : { status: ERecordStatus.ACTIVE },
        ],
      },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      select: { ...this.getSelectFields(langCode, { hasCate: true }) },
    });
    if (keywords) {
      const filterSubCategories = subCategories.filter((subCategory) =>
        langCode === ELang.EN
          ? subCategory.nameEn.toLowerCase().includes(keywords.toLowerCase())
          : subCategory.nameVn.toLowerCase().includes(keywords.toLowerCase()),
      );
      collection = utils.paging<SubCategory>(filterSubCategories, page, limit);
    } else collection = utils.paging<SubCategory>(subCategories, page, limit);
    const items = this.convertCollection(collection.items, langCode);
    return { ...collection, items };
  }

  async getSubCategory(query: QueryDto) {
    const { subCategoryId, langCode, convertName } = query;
    const subCategory = await this.prisma.subCategory.findUnique({
      where: { id: subCategoryId, isDelete: { equals: false } },
      select: { ...this.getSelectFields(langCode, { convertName }) },
    });
    const convertResponse = utils.convertRecordsName<SubCategory>({ ...subCategory }, langCode);
    return convertName ? convertResponse : subCategory;
  }

  async createSubCategory(file: Express.Multer.File, subCategory: SubCategoryDto) {
    const { nameEn, nameVn, status, categoryId } = subCategory;
    const newSubCategory = await this.prisma.subCategory.create({
      data: { nameEn, nameVn, status: Number(status), categoryId, isDelete: false },
    });
    if (newSubCategory) {
      if (!file) return newSubCategory;
      const result = await this.cloudinary.upload(utils.getFileUrl(file));
      const image = utils.generateImage(result, { subCategoryId: newSubCategory.id });
      await this.prisma.image.create({ data: { ...image, isDelete: false } });
      const resSubCategory = await this.prisma.subCategory.findUnique({ where: { id: newSubCategory.id } });
      return resSubCategory;
    }
    throw new HttpException('Create failed', HttpStatus.BAD_REQUEST)
  }

  async updateSubCategory(query: QueryDto, file: Express.Multer.File, subCategory: SubCategoryDto) {
    const { subCategoryId } = query;
    const { nameEn, nameVn, status, categoryId } = subCategory;
    await this.prisma.subCategory.update({
      where: { id: subCategoryId },
      data: { nameEn, nameVn, status: Number(status), categoryId },
    });
    if (file) {
      const updateSubCategory = await this.prisma.subCategory.findUnique({
        where: { id: subCategoryId },
        select: { image: true },
      });
      const result = await this.cloudinary.upload(utils.getFileUrl(file));
      const image = utils.generateImage(result, { subCategoryId });
      if (updateSubCategory.image) {
        await this.cloudinary.destroy(updateSubCategory.image.publicId);
        await this.prisma.image.update({ where: { subCategoryId }, data: image });
      } else {
        await this.prisma.image.create({ data: { ...image, isDelete: false } });
      }
    }
    throw new HttpException('Updated success', HttpStatus.OK);
  }

  async removeSubCategories(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const subCategories = await this.prisma.subCategory.findMany({
      where: { id: { in: listIds } },
      select: { id: true, image: true },
    });
    if (subCategories && !subCategories.length)
      throw new HttpException('Subcategory not found', HttpStatus.NOT_FOUND);
    await this.prisma.subCategory.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    await Promise.all(
      subCategories.map(async (subCategory) => {
        if (!subCategory.image) return;
        await this.prisma.image.update({
          where: { subCategoryId: subCategory.id },
          data: { isDelete: true },
        });
      }),
    );
    throw new HttpException('Removed success', HttpStatus.OK);
  }

  async removeSubCategoriesPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const subCategories = await this.prisma.subCategory.findMany({
      where: { id: { in: listIds } },
      include: { image: true },
    });
    if (subCategories && !subCategories.length)
      throw new HttpException('Subcategory not found', HttpStatus.NOT_FOUND);
    await this.prisma.subCategory.deleteMany({ where: { id: { in: listIds } } });
    await Promise.all(
      subCategories.map(async (subCategory) => {
        if (!subCategory.image) return;
        await this.cloudinary.destroy(subCategory.image.publicId);
      }),
    );
    throw new HttpException('Removed success', HttpStatus.OK);
  }

  async restoreSubCategories() {
    const subCategories = await this.prisma.subCategory.findMany({
      where: { isDelete: { equals: true } },
      select: { id: true, image: true },
    });
    if (subCategories && !subCategories.length)
      throw new HttpException('There are no data to restored', HttpStatus.OK);
    await Promise.all(
      subCategories.map(async (subCategory) => {
        await this.prisma.subCategory.update({ where: { id: subCategory.id }, data: { isDelete: false } });
        if (subCategory.image)
          await this.prisma.image.update({
            where: { subCategoryId: subCategory.id },
            data: { isDelete: false },
          });
      }),
    );

    throw new HttpException('Restored success', HttpStatus.OK);
  }
}
