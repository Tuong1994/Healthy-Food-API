import { Injectable } from '@nestjs/common';
import { Category, PrismaClient, SubCategory } from '@prisma/client';
import { SubCategoryWithPayload } from './subcategory.type';
import { PrismaService } from '../prisma/prisma.service';
import { ELang } from 'src/common/enum/base';
import { SelectFieldsOptions } from 'src/common/type/base';
import utils from 'src/utils';

@Injectable()
export class SubCategoryHelper {
  constructor(private prisma: PrismaService) {}

  getSelectFields(langCode: ELang, options?: SelectFieldsOptions) {
    return {
      id: true,
      image: true,
      nameVn: options?.convertLang ? langCode === ELang.VN : true,
      nameEn: options?.convertLang ? langCode === ELang.EN : true,
      categoryId: true,
      status: true,
      isDelete: true,
      createdAt: true,
      updatedAt: true,
      category: options?.hasCate
        ? {
            select: {
              id: true,
              nameVn: options?.convertLang ? langCode === ELang.VN : true,
              nameEn: options?.convertLang ? langCode === ELang.EN : true,
            },
          }
        : false,
    };
  }

  convertCollection(subCategories: SubCategory[], langCode: ELang) {
    return subCategories.map((subCategory) => ({
      ...utils.convertRecordsName<SubCategory>(subCategory, langCode),
      category:
        'category' in subCategory
          ? { ...utils.convertRecordsName<Category>(subCategory.category as Category, langCode) }
          : null,
    }));
  }

  async handleUpdateIsDeleteSubCategoryImage(subCategory: SubCategoryWithPayload, isDelete: boolean) {
    await this.prisma.image.update({
      where: { subCategoryId: subCategory.id },
      data: { isDelete },
    });
  }

  async handleRestoreSubCategory(subCategory: SubCategoryWithPayload) {
    await this.prisma.subCategory.update({ where: { id: subCategory.id }, data: { isDelete: false } });
  }
}
