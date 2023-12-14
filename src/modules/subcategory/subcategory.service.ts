import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { SubCategory } from '@prisma/client';
import { SubCategoryDto } from './subcategory.dto';
import utils from 'src/utils';
import helper from 'src/helper';

@Injectable()
export class SubCategoryService {
  constructor(private prisma: PrismaService) {}

  async getSubCategories(query: QueryDto) {
    const { keywords, sortBy, langCode } = query;
    const subCategories = await this.prisma.subCategory.findMany({
      where: { langCode },
      orderBy: [{ updatedAt: helper.getSortBy(sortBy) ?? 'desc' }],
    });
    if (keywords)
      return subCategories.filter((subCategory) =>
        subCategory.name.toLowerCase().includes(keywords.toLowerCase()),
      );
    return subCategories;
  }

  async getSubCategoriesPaging(query: QueryDto) {
    const { page, limit, keywords, sortBy, langCode } = query;
    let collection: Paging<SubCategory> = utils.defaultCollection();
    const subCategories = await this.prisma.subCategory.findMany({
      where: { langCode },
      orderBy: [{ updatedAt: helper.getSortBy(sortBy) ?? 'desc' }],
    });
    if (keywords) {
      const filterSubCategories = subCategories.filter((subCategory) =>
        subCategory.name.toLowerCase().includes(keywords.toLowerCase()),
      );
      collection = utils.paging<SubCategory>(filterSubCategories, page, limit);
    } else collection = utils.paging<SubCategory>(subCategories, page, limit);
    return collection;
  }

  async getSubCategory(query: QueryDto) {
    const { subCategoryId, langCode } = query;
    const subCategory = await this.prisma.subCategory.findUnique({ where: { id: subCategoryId, langCode } });
    return subCategory;
  }

  async createSubCategory(query: QueryDto, subCategory: SubCategoryDto) {
    const { langCode } = query;
    const { name, categoryId } = subCategory;
    const newSubCategory = await this.prisma.subCategory.create({
      data: { name, categoryId, langCode },
    });
    return newSubCategory;
  }

  async updateSubCategory(query: QueryDto, subCategory: SubCategoryDto) {
    const { subCategoryId, langCode } = query;
    const { name, categoryId } = subCategory;
    await this.prisma.subCategory.update({
      where: { id: subCategoryId },
      data: { name, langCode, categoryId },
    });
    throw new HttpException('Updated success', HttpStatus.OK);
  }

  async removeSubCategories(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const subCategories = await this.prisma.subCategory.findMany({ where: { id: { in: listIds } } });
    if (subCategories && subCategories.length > 0) {
      await this.prisma.subCategory.deleteMany({ where: { id: { in: listIds } } });
      throw new HttpException('Removed success', HttpStatus.OK);
    }
    throw new HttpException('Subcategory not found', HttpStatus.NOT_FOUND);
  }
}
