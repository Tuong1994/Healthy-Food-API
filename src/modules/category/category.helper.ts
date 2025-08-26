import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Category, Prisma, SubCategory } from '@prisma/client';
import { ELang } from 'src/common/enum/base';
import { SelectFieldsOptions } from 'src/common/type/base';
import { CategoryWithPayload } from './category.type';
import utils from 'src/utils';

@Injectable()
export class CategoryHelper {
  constructor(private prisma: PrismaService) {}

  getSelectFields(langCode: ELang, options: SelectFieldsOptions): Prisma.CategorySelect {
    return {
      id: true,
      image: true,
      nameVn: options.convertLang ? langCode === ELang.VN : true,
      nameEn: options.convertLang ? langCode === ELang.EN : true,
      status: true,
      isDelete: true,
      createdAt: true,
      updatedAt: true,
      subCategories: options.hasSub
        ? {
            select: {
              id: true,
              image: true,
              nameVn: options.convertLang ? langCode === ELang.VN : true,
              nameEn: options.convertLang ? langCode === ELang.EN : true,
              status: true,
              isDelete: true,
              createdAt: true,
              updatedAt: true,
            },
          }
        : false,
    };
  }

  convertCollection(categories: Category[], langCode: ELang) {
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

  async handleUpdateIsDeleteCategoryImage(category: CategoryWithPayload, isDelete: boolean) {
    await this.prisma.image.update({ where: { categoryId: category.id }, data: { isDelete } });
  }

  async handleUpdateIsDeleteSubCategories(category: CategoryWithPayload, isDelete: boolean) {
    await this.prisma.subCategory.updateMany({ where: { categoryId: category.id }, data: { isDelete } });
  }

  async handleRestoreCategory(category: CategoryWithPayload) {
    await this.prisma.category.update({ where: { id: category.id }, data: { isDelete: false } });
  }
}
