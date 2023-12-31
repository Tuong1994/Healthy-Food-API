import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { Category } from '@prisma/client';
import { CategoryDto } from './category.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ELang } from 'src/common/enum/base';
import utils from 'src/utils';
import helper from 'src/helper';

const getSelectFields = (langCode: ELang, hasSub: boolean) => ({
  id: true,
  image: true,
  nameVn: langCode === ELang.VN,
  nameEn: langCode === ELang.EN,
  isDelete: true,
  createdAt: true,
  updatedAt: true,
  subCategories: hasSub
    ? {
        select: {
          id: true,
          image: true,
          nameVn: langCode === ELang.VN,
          nameEn: langCode === ELang.EN,
          isDelete: true,
          createdAt: true,
          updatedAt: true,
        },
      }
    : false,
});

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async getCategories(query: QueryDto) {
    const { keywords, sortBy, langCode, hasSub } = query;
    const categories = await this.prisma.category.findMany({
      where: { isDelete: false },
      orderBy: [{ updatedAt: helper.getSortBy(sortBy) ?? 'desc' }],
      select: { ...getSelectFields(langCode, hasSub) },
    });
    if (keywords)
      return categories.filter(
        (category) =>
          category.nameEn.toLowerCase().includes(keywords.toLowerCase()) ||
          category.nameVn.toLowerCase().includes(keywords.toLowerCase()),
      );
    return { totalItems: categories.length, data: categories };
  }

  async getCategoriesPaging(query: QueryDto) {
    const { page, limit, keywords, sortBy, langCode, hasSub } = query;
    let collection: Paging<Category> = utils.defaultCollection();
    const categories = await this.prisma.category.findMany({
      where: { isDelete: false },
      orderBy: [{ updatedAt: helper.getSortBy(sortBy) ?? 'desc' }],
      select: { ...getSelectFields(langCode, hasSub) },
    });
    if (keywords) {
      const filterCategories = categories.filter(
        (category) =>
          category.nameEn.toLowerCase().includes(keywords.toLowerCase()) ||
          category.nameVn.toLowerCase().includes(keywords.toLowerCase()),
      );
      collection = utils.paging<Category>(filterCategories, page, limit);
    } else collection = utils.paging<Category>(categories, page, limit);
    return collection;
  }

  async getCategory(query: QueryDto) {
    const { categoryId, langCode, hasSub } = query;
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId, isDelete: false },
      select: { ...getSelectFields(langCode, hasSub) },
    });
    return category;
  }

  async createCategory(file: Express.Multer.File, category: CategoryDto) {
    const { nameEn, nameVn } = category;
    const newCategory = await this.prisma.category.create({
      data: { nameEn, nameVn, isDelete: false },
    });
    if (newCategory) {
      if (!file) return newCategory;
      const result = await this.cloudinary.upload(utils.getFileUrl(file));
      const image = utils.generateImage(result, { categoryId: newCategory.id });
      await this.prisma.image.create({ data: image });
      const resCategory = await this.prisma.category.findUnique({
        where: { id: newCategory.id },
        include: { image: true },
      });
      return resCategory;
    }
  }

  async updateCategory(query: QueryDto, file: Express.Multer.File, category: CategoryDto) {
    const { categoryId } = query;
    const { nameEn, nameVn } = category;
    await this.prisma.category.update({ where: { id: categoryId }, data: { nameEn, nameVn } });
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
        await this.prisma.image.create({ data: image });
      }
    }
    throw new HttpException('Updated success', HttpStatus.OK);
  }

  async removeCategories(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const categories = await this.prisma.category.findMany({
      where: { id: { in: listIds } },
      select: { id: true, image: true },
    });
    if (categories && categories.length > 0) {
      await this.prisma.category.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
      await Promise.all(
        categories.map(async (category) => {
          if (!category.image) return;
          await this.prisma.image.update({ where: { categoryId: category.id }, data: { isDelete: true } });
        }),
      );
      throw new HttpException('Removed success', HttpStatus.OK);
    }
    throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
  }

  async removeCategoriesPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const categories = await this.prisma.category.findMany({
      where: { id: { in: listIds } },
      include: { image: true },
    });
    if (categories && categories.length > 0) {
      await this.prisma.category.deleteMany({ where: { id: { in: listIds } } });
      await Promise.all(
        categories.map(async (category) => {
          if (!category.image) return;
          await this.cloudinary.destroy(category.image.publicId);
        }),
      );
      throw new HttpException('Removed success', HttpStatus.OK);
    }
    throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
  }

  async restoreCategories() {
    await this.prisma.category.updateMany({ data: { isDelete: false } });
    throw new HttpException('Restored success', HttpStatus.OK);
  }
}
