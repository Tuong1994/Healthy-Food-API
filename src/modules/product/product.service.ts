import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { ELang, ERecordStatus } from 'src/common/enum/base';
import { Paging, SelectFieldsOptions } from 'src/common/type/base';
import { Category, Product } from '@prisma/client';
import { ProductDto } from './product.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ProductHelper } from './product.helper';
import utils from 'src/utils';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
    private productHelper: ProductHelper,
  ) {}

  private getSelectFields(langCode: ELang, options?: SelectFieldsOptions) {
    return {
      id: true,
      nameEn: options?.convertName ? langCode === ELang.EN : true,
      nameVn: options?.convertName ? langCode === ELang.VN : true,
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

  private convertCollection(products: Product[], langCode: ELang) {
    return products.map((product) => ({
      ...utils.convertRecordsName<Product>(product, langCode),
      category:
        'category' in product
          ? utils.convertRecordsName<Category>(product.category as Category, langCode)
          : null,
    }));
  }

  async getProductsWithCategories(query: QueryDto) {
    const { langCode, sortBy, hasCate, hasLike } = query;

    const categories = await this.prisma.category.findMany({
      where: { isDelete: { equals: false } },
      select: { id: true },
    });

    if (categories && categories.length) {
      const items = await Promise.all(
        categories.map(async (category) => {
          const products = await this.prisma.product.findMany({
            where: {
              AND: [
                { categoryId: category.id },
                { isDelete: { equals: false } },
                { status: ERecordStatus.ACTIVE },
              ],
            },
            orderBy: [
              { totalPrice: utils.getSortBy(sortBy) ?? 'asc' },
              { updatedAt: utils.getSortBy(sortBy) ?? 'asc' },
            ],
            select: { ...this.getSelectFields(langCode, { hasCate, hasLike, convertName: true }) },
          });
          const convertProducts = this.convertCollection(products, langCode);
          const collection = utils.paging<Product>(convertProducts, '1', '10');
          return collection;
        }),
      );
      return { totalItems: items.length, items };
    }
  }

  async getProductsPaging(query: QueryDto) {
    const {
      page,
      limit,
      sortBy,
      keywords,
      langCode,
      categoryId,
      subCategoryId,
      productStatus,
      productUnit,
      inventoryStatus,
      origin,
      hasCate,
      hasLike,
    } = query;

    let collection: Paging<Product> = utils.defaultCollection();
    const products = await this.prisma.product.findMany({
      where: {
        AND: [
          { categoryId },
          { subCategoryId },
          { isDelete: { equals: false } },
          { origin: origin && Number(origin) },
          { unit: productUnit && Number(productUnit) },
          { inventoryStatus: inventoryStatus && Number(inventoryStatus) },
          productStatus
            ? Number(productStatus) !== ERecordStatus.ALL
              ? { status: Number(productStatus) }
              : {}
            : { status: ERecordStatus.ACTIVE },
        ],
      },
      orderBy: [
        { updatedAt: utils.getSortBy(sortBy) ?? 'desc' },
        { totalPrice: utils.getSortBy(sortBy) ?? 'asc' },
      ],
      select: { ...this.getSelectFields(langCode, { hasCate, hasLike, convertName: true }) },
    });

    if (keywords) {
      const filterProducts = products.filter((product) =>
        langCode === ELang.EN
          ? product.nameEn.toLowerCase().includes(keywords.toLowerCase())
          : product.nameVn.toLowerCase().includes(keywords.toLowerCase()),
      );
      collection = utils.paging<Product>(filterProducts, page, limit);
    } else collection = utils.paging<Product>(products, page, limit);
    const items = this.convertCollection(collection.items, langCode);
    return { ...collection, items };
  }

  async getProduct(query: QueryDto) {
    const { productId, langCode, hasCate, hasLike, convertName } = query;
    const product = await this.prisma.product.findUnique({
      where: { id: productId, isDelete: { equals: false } },
      select: { ...this.getSelectFields(langCode, { hasCate, hasLike, convertName }), rates: true },
    });
    const response = {
      ...product,
      totalVoted: product.rates.length,
      point: this.productHelper.getRatePoints(product.rates),
    };
    delete response.rates;
    const convertResponse = {
      ...utils.convertRecordsName<Product>({ ...response }, langCode),
      category:
        'category' in response
          ? { ...utils.convertRecordsName<Category>(response.category as Category, langCode) }
          : null,
    };
    return convertName ? convertResponse : response;
  }

  async createProduct(file: Express.Multer.File, product: ProductDto) {
    const {
      nameEn,
      nameVn,
      costPrice,
      profit,
      totalPrice,
      unit,
      status,
      inventory,
      inventoryStatus,
      supplier,
      origin,
      categoryId,
      subCategoryId,
    } = product;

    const newProduct = await this.prisma.product.create({
      data: {
        nameEn,
        nameVn,
        costPrice: Number(costPrice),
        profit: Number(profit),
        totalPrice: Number(totalPrice),
        inventory: Number(inventory),
        inventoryStatus: Number(inventoryStatus),
        unit: Number(unit),
        status: Number(status),
        origin: Number(origin),
        isNew: true,
        supplier,
        categoryId,
        subCategoryId,
        isDelete: false,
      },
    });

    if (newProduct) {
      if (!file) return newProduct;
      const result = await this.cloudinary.upload(utils.getFileUrl(file));
      const image = utils.generateImage(result, { productId: newProduct.id });
      await this.prisma.image.create({ data: { ...image, isDelete: false } });
      const resProduct = await this.prisma.product.findUnique({
        where: { id: newProduct.id },
        include: { image: true },
      });
      return resProduct;
    }
    throw new HttpException('Create failed', HttpStatus.BAD_REQUEST);
  }

  async updateProduct(query: QueryDto, file: Express.Multer.File, product: ProductDto) {
    const { productId } = query;
    const {
      nameEn,
      nameVn,
      costPrice,
      profit,
      totalPrice,
      unit,
      status,
      inventory,
      inventoryStatus,
      supplier,
      origin,
      categoryId,
      subCategoryId,
      isNew,
    } = product;

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        nameEn,
        nameVn,
        costPrice: Number(costPrice),
        profit: Number(profit),
        totalPrice: Number(totalPrice),
        inventory: Number(inventory),
        inventoryStatus: Number(inventoryStatus),
        unit: Number(unit),
        status: Number(status),
        origin: Number(origin),
        isNew: Boolean(isNew),
        supplier,
        categoryId,
        subCategoryId,
      },
    });

    if (file) {
      const updateProduct = await this.prisma.product.findUnique({
        where: { id: productId },
        select: { image: true },
      });
      const result = await this.cloudinary.upload(utils.getFileUrl(file));
      const image = utils.generateImage(result, { productId });
      if (updateProduct.image) {
        await this.cloudinary.destroy(updateProduct.image.publicId);
        await this.prisma.product.update({ where: { id: productId }, data: image });
      } else {
        await this.prisma.image.create({ data: { ...image, isDelete: false } });
      }
    }

    throw new HttpException('Updated success', HttpStatus.OK);
  }

  async removeProducts(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const products = await this.prisma.product.findMany({
      where: { id: { in: listIds } },
      select: { id: true, image: true, comments: true, rates: true, likes: true },
    });
    if (products && !products.length) throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    await this.prisma.product.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    await Promise.all(
      products.map(async (product) => {
        if (product.image)
          await this.prisma.image.update({ where: { productId: product.id }, data: { isDelete: true } });
        if (product.comments.length > 0)
          await this.prisma.comment.updateMany({
            where: { productId: product.id },
            data: { isDelete: true },
          });
        if (product.rates.length > 0)
          await this.prisma.rate.updateMany({
            where: { productId: product.id },
            data: { isDelete: true },
          });
        if (product.likes.length > 0)
          await this.prisma.like.updateMany({
            where: { productId: product.id },
            data: { isDelete: true },
          });
      }),
    );
    throw new HttpException('Removed success', HttpStatus.OK);
  }

  async removeProductsPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const products = await this.prisma.product.findMany({
      where: { id: { in: listIds } },
      include: { image: true },
    });
    if (products && !products.length) throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    await this.prisma.product.deleteMany({ where: { id: { in: listIds } } });
    await Promise.all(
      products.map(async (product) => {
        if (!product.image) return;
        await this.cloudinary.destroy(product.image.publicId);
      }),
    );
    throw new HttpException('Removed success', HttpStatus.OK);
  }

  async restoreProducts() {
    const products = await this.prisma.product.findMany({
      where: { isDelete: { equals: true } },
      select: { id: true, image: true, comments: true, rates: true, likes: true },
    });
    if (products && !products.length) throw new HttpException('There are no data to restored', HttpStatus.OK);
    await Promise.all(
      products.map(async (product) => {
        await this.prisma.product.update({ where: { id: product.id }, data: { isDelete: false } });
        if (product.image)
          await this.prisma.image.update({ where: { productId: product.id }, data: { isDelete: false } });
        if (product.comments.length > 0)
          await this.prisma.comment.updateMany({
            where: { productId: product.id },
            data: { isDelete: false },
          });
        if (product.rates.length > 0)
          await this.prisma.rate.updateMany({
            where: { productId: product.id },
            data: { isDelete: false },
          });
        if (product.likes.length > 0)
          await this.prisma.like.updateMany({
            where: { productId: product.id },
            data: { isDelete: false },
          });
      }),
    );
    throw new HttpException('Restored success', HttpStatus.OK);
  }
}
