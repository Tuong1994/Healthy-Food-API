import { Injectable } from '@nestjs/common';
import { Category, Prisma, Product, Rate } from '@prisma/client';
import { ELang } from 'src/common/enum/base';
import { SelectFieldsOptions } from 'src/common/type/base';
import { ProductWithPayload } from './product.type';
import { PrismaService } from '../prisma/prisma.service';
import utils from 'src/utils';

@Injectable()
export class ProductHelper {
  constructor(private prisma: PrismaService) {}

  getRatePoints(rates: Rate[]) {
    if (rates.length === 0) return 0;
    const oneRates = rates.filter((rate) => rate.point === 1).length;
    const twoRates = rates.filter((rate) => rate.point === 2).length;
    const threeRates = rates.filter((rate) => rate.point === 3).length;
    const fourRates = rates.filter((rate) => rate.point === 4).length;
    const fiveRates = rates.filter((rate) => rate.point === 5).length;
    const totalPoint = oneRates * 1 + twoRates * 2 + threeRates * 3 + fourRates * 4 + fiveRates * 5;
    const totalRes = oneRates + twoRates + threeRates + fourRates + fiveRates;
    return Math.ceil(totalPoint / totalRes);
  }

  getSelectFields(langCode: ELang, options?: SelectFieldsOptions): Prisma.ProductSelect {
    return {
      id: true,
      nameEn: options?.convertLang ? langCode === ELang.EN : true,
      nameVn: options?.convertLang ? langCode === ELang.VN : true,
      descriptionEn: options?.convertLang ? langCode === ELang.EN : true,
      descriptionVn: options?.convertLang ? langCode === ELang.VN : true,
      image: true,
      costPrice: true,
      profit: true,
      totalPrice: true,
      unit: true,
      status: true,
      inventoryStatus: true,
      inventory: true,
      supplier: true,
      origin: true,
      subCategoryId: true,
      categoryId: true,
      isNew: true,
      isDelete: true,
      createdAt: true,
      updatedAt: true,
      category: options?.hasCate
        ? {
            select: {
              id: true,
              nameEn: langCode === ELang.EN,
              nameVn: langCode === ELang.VN,
            },
          }
        : false,
      likes: options?.hasLike
        ? {
            select: {
              id: true,
              productId: true,
              userId: true,
            },
          }
        : false,
    };
  }

  convertDescription<M>(record: M, langCode: ELang) {
    if (!record) return null;
    const recordClone = { ...record };
    delete record['descriptionEn'];
    delete record['descriptionVn'];
    const data = {
      description: langCode === ELang.EN ? recordClone['descriptionEn'] : recordClone['descriptionVn'],
      ...record,
    };
    return data;
  }

  convertCollection(products: Product[], langCode: ELang) {
    return products.map((product) => {
      const convertProduct = { ...utils.convertRecordsName<Product>(product, langCode) };
      delete convertProduct['descriptionEn'];
      delete convertProduct['descriptionVn'];
      return {
        ...convertProduct,
        ...this.convertDescription<Product>(product, langCode),
        category:
          'category' in product
            ? utils.convertRecordsName<Category>(product.category as Category, langCode)
            : null,
      };
    });
  }

  async handleUpdateIsDeleteProductImage(product: ProductWithPayload, isDelete: boolean) {
    await this.prisma.image.update({ where: { productId: product.id }, data: { isDelete } });
  }

  async handleUpdateIsDeleteProductComment(product: ProductWithPayload, isDelete: boolean) {
    await this.prisma.comment.updateMany({ where: { productId: product.id }, data: { isDelete } });
  }

  async handleUpdateIsDeleteProductRate(product: ProductWithPayload, isDelete: boolean) {
    await this.prisma.rate.updateMany({ where: { productId: product.id }, data: { isDelete } });
  }

  async handleUpdateIsDeleteProductLike(product: ProductWithPayload, isDelete: boolean) {
    await this.prisma.like.updateMany({ where: { productId: product.id }, data: { isDelete } });
  }

  async handleRestoreProduct(product: ProductWithPayload) {
    await this.prisma.product.update({ where: { id: product.id }, data: { isDelete: false } });
  }
}
