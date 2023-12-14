import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { ELang } from 'src/common/enum/base';
import { EInventoryStatus } from './product.enum';
import { Paging } from 'src/common/type/base';
import { Product } from '@prisma/client';
import { ProductDto } from './product.dto';
import helper from 'src/helper';
import utils from 'src/utils';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getProducts(query: QueryDto) {
    const { langCode, subCategoryId, productStatus, inventoryStatus, sortBy, keywords } = query;

    const products = await this.prisma.product.findMany({
      where: {
        AND: [
          { subCategoryId },
          { status: productStatus },
          { langCode: langCode ?? ELang.EN },
          { inventoryStatus: inventoryStatus ?? EInventoryStatus.IN_STOCK },
        ],
      },
      orderBy: [
        { totalPrice: helper.getSortBy(sortBy) ?? 'asc' },
        { updatedAt: helper.getSortBy(sortBy) ?? 'desc' },
      ],
    });

    if (keywords)
      return products.filter((product) => product.name.toLowerCase().includes(keywords.toLowerCase()));
    return products;
  }

  async getProductsPaging(query: QueryDto) {
    const { page, limit, sortBy, keywords, langCode, subCategoryId, productStatus, inventoryStatus } = query;

    let collection: Paging<Product> = utils.defaultCollection();
    const products = await this.prisma.product.findMany({
      where: {
        AND: [
          { subCategoryId },
          { status: productStatus },
          { langCode: langCode ?? ELang.EN },
          { inventoryStatus: inventoryStatus ?? EInventoryStatus.IN_STOCK },
        ],
      },
      orderBy: [
        { totalPrice: helper.getSortBy(sortBy) ?? 'asc' },
        { updatedAt: helper.getSortBy(sortBy) ?? 'desc' },
      ],
    });

    if (keywords) {
      const filterProducts = products.filter((product) =>
        product.name.toLowerCase().includes(keywords.toLowerCase()),
      );
      collection = utils.paging<Product>(filterProducts, page, limit);
    } else collection = utils.paging<Product>(products, page, limit);

    return collection;
  }

  async getProduct(query: QueryDto) {
    const { productId, langCode } = query;
    const product = await this.prisma.product.findUnique({ where: { id: productId, langCode } });
    return product;
  }

  async createProduct(query: QueryDto, product: ProductDto) {
    const { langCode } = query;
    const {
      name,
      costPrice,
      profit,
      totalPrice,
      description,
      status,
      inventory,
      inventoryStatus,
      subCategoryId,
    } = product;

    const newProduct = await this.prisma.product.create({
      data: {
        name,
        costPrice,
        profit,
        totalPrice,
        description,
        status,
        inventory,
        inventoryStatus,
        subCategoryId,
        langCode,
      },
    });

    return newProduct;
  }

  async updateProduct(query: QueryDto, product: ProductDto) {
    const { langCode, productId } = query;
    const {
      name,
      costPrice,
      profit,
      totalPrice,
      description,
      status,
      inventory,
      inventoryStatus,
      subCategoryId,
    } = product;

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        name,
        costPrice,
        profit,
        totalPrice,
        description,
        status,
        inventory,
        inventoryStatus,
        subCategoryId,
        langCode,
      },
    });

    throw new HttpException('Updated success', HttpStatus.OK);
  }

  async removeProducts(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const products = await this.prisma.product.findMany({ where: { id: { in: listIds } } });
    if (products && products.length > 0) {
      await this.prisma.product.deleteMany({ where: { id: { in: listIds } } });
      throw new HttpException('Removed success', HttpStatus.OK);
    }
    throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
  }
}
