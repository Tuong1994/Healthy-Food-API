import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { Category } from '@prisma/client';
import { CategoryDto } from './category.dto';
import utils from 'src/utils';
import helper from 'src/helper';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getCategories(query: QueryDto) {
    const { keywords, sortBy, langCode, hasSub } = query;
    const categories = await this.prisma.category.findMany({
      where: { langCode },
      orderBy: [{ updatedAt: helper.getSortBy(sortBy) ?? 'desc' }],
      include: { subCategories: hasSub ? { where: { langCode } } : false },
    });
    if (keywords)
      return categories.filter((category) => category.name.toLowerCase().includes(keywords.toLowerCase()));
    return categories;
  }

  async getCategoriesPaging(query: QueryDto) {
    const { page, limit, keywords, sortBy, langCode, hasSub } = query;
    let collection: Paging<Category> = utils.defaultCollection();
    const categories = await this.prisma.category.findMany({
      where: { langCode },
      orderBy: [{ updatedAt: helper.getSortBy(sortBy) ?? 'desc' }],
      include: { subCategories: hasSub ? { where: { langCode } } : false },
    });
    if (keywords) {
      const filterCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(keywords.toLowerCase()),
      );
      collection = utils.paging<Category>(filterCategories, page, limit);
    } else collection = utils.paging<Category>(categories, page, limit);
    return collection;
  }

  async getCategory(query: QueryDto) {
    const { categoryId, langCode, hasSub } = query;
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId, langCode },
      include: { subCategories: hasSub ? { where: { langCode } } : false },
    });
    return category;
  }

  async createCategory(query: QueryDto, category: CategoryDto) {
    const { langCode } = query;
    const { name } = category;
    const newCategory = await this.prisma.category.create({
      data: { name, langCode },
    });
    return newCategory;
  }

  async updateCategory(query: QueryDto, category: CategoryDto) {
    const { categoryId, langCode } = query;
    const { name } = category;
    await this.prisma.category.update({ where: { id: categoryId }, data: { name, langCode } });
    throw new HttpException('Updated success', HttpStatus.OK);
  }

  async removeCategories(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const categories = await this.prisma.category.findMany({ where: { id: { in: listIds } } });
    if (categories && categories.length > 0) {
      await this.prisma.category.deleteMany({ where: { id: { in: listIds } } });
      throw new HttpException('Removed success', HttpStatus.OK);
    }
    throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
  }
}
