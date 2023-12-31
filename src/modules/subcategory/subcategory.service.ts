import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { SubCategory } from '@prisma/client';
import { SubCategoryDto } from './subcategory.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ELang } from 'src/common/enum/base';
import utils from 'src/utils';
import helper from 'src/helper';

const getSelectFields = (langCode: ELang) => ({
  id: true,
  image: true,
  nameVn: langCode === ELang.VN,
  nameEn: langCode === ELang.EN,
  categoryId: true,
  isDelete: true,
  createdAt: true,
  updatedAt: true,
});

@Injectable()
export class SubCategoryService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async getSubCategories(query: QueryDto) {
    const { keywords, sortBy, categoryId, langCode } = query;
    const subCategories = await this.prisma.subCategory.findMany({
      where: { AND: [{ categoryId }, { isDelete: { equals: false } }] },
      orderBy: [{ updatedAt: helper.getSortBy(sortBy) ?? 'desc' }],
      select: { ...getSelectFields(langCode) },
    });
    if (keywords)
      return subCategories.filter(
        (subCategory) =>
          subCategory.nameEn.toLowerCase().includes(keywords.toLowerCase()) ||
          subCategory.nameVn.toLowerCase().includes(keywords.toLowerCase()),
      );
    return { totalItems: subCategories.length, data: subCategories };
  }

  async getSubCategoriesPaging(query: QueryDto) {
    const { page, limit, keywords, sortBy, categoryId, langCode } = query;
    let collection: Paging<SubCategory> = utils.defaultCollection();
    const subCategories = await this.prisma.subCategory.findMany({
      where: { AND: [{ categoryId }, { isDelete: { equals: false } }] },
      orderBy: [{ updatedAt: helper.getSortBy(sortBy) ?? 'desc' }],
      select: { ...getSelectFields(langCode) },
    });
    if (keywords) {
      const filterSubCategories = subCategories.filter(
        (subCategory) =>
          subCategory.nameEn.toLowerCase().includes(keywords.toLowerCase()) ||
          subCategory.nameVn.toLowerCase().includes(keywords.toLowerCase()),
      );
      collection = utils.paging<SubCategory>(filterSubCategories, page, limit);
    } else collection = utils.paging<SubCategory>(subCategories, page, limit);
    return collection;
  }

  async getSubCategory(query: QueryDto) {
    const { subCategoryId, langCode } = query;
    const subCategory = await this.prisma.subCategory.findUnique({
      where: { id: subCategoryId, isDelete: { equals: false } },
      select: { ...getSelectFields(langCode) },
    });
    return subCategory;
  }

  async createSubCategory(file: Express.Multer.File, subCategory: SubCategoryDto) {
    const { nameEn, nameVn, categoryId } = subCategory;
    const newSubCategory = await this.prisma.subCategory.create({
      data: { nameEn, nameVn, categoryId, isDelete: false },
    });
    if (newSubCategory) {
      if (!file) return newSubCategory;
      const result = await this.cloudinary.upload(utils.getFileUrl(file));
      const image = utils.generateImage(result, { subCategoryId: newSubCategory.id });
      await this.prisma.image.create({ data: image });
      const resSubCategory = await this.prisma.subCategory.findUnique({ where: { id: newSubCategory.id } });
      return resSubCategory;
    }
  }

  async updateSubCategory(query: QueryDto, file: Express.Multer.File, subCategory: SubCategoryDto) {
    const { subCategoryId } = query;
    const { nameEn, nameVn, categoryId } = subCategory;
    await this.prisma.subCategory.update({
      where: { id: subCategoryId },
      data: { nameEn, nameVn, categoryId },
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
        await this.prisma.image.create({ data: image });
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
    if (subCategories && subCategories.length > 0) {
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
    throw new HttpException('Subcategory not found', HttpStatus.NOT_FOUND);
  }

  async removeSubCategoriesPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const subCategories = await this.prisma.subCategory.findMany({
      where: { id: { in: listIds } },
      include: { image: true },
    });
    if (subCategories && subCategories.length > 0) {
      await this.prisma.subCategory.deleteMany({ where: { id: { in: listIds } } });
      await Promise.all(
        subCategories.map(async (subCategory) => {
          if (!subCategory.image) return;
          await this.cloudinary.destroy(subCategory.image.publicId);
        }),
      );
      throw new HttpException('Removed success', HttpStatus.OK);
    }
    throw new HttpException('Subcategory not found', HttpStatus.NOT_FOUND);
  }

  async restoreSubCategories() {
    await this.prisma.subCategory.updateMany({ data: { isDelete: false } });
    throw new HttpException('Restored success', HttpStatus.OK);
  }
}
