import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ELang } from 'src/common/enum/base';
import { SelectFieldsOptions } from 'src/common/type/base';
import { CategoryWithPayload } from './category.type';

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

  async handleUpdateIsDeleteCategoryImage(category: CategoryWithPayload, isDelete: boolean) {
    await this.prisma.image.update({ where: { categoryId: category.id }, data: { isDelete } });
  }
}
