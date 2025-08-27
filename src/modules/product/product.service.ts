import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { ELang, ERecordStatus } from 'src/common/enum/base';
import { Paging } from 'src/common/type/base';
import { Category, Product } from '@prisma/client';
import { ProductDto } from './product.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ProductHelper } from './product.helper';
import responseMessage from 'src/common/message';
import utils from 'src/utils';

const { CREATE_ERROR, UPDATE_SUCCESS, REMOVE_SUCCESS, RESTORE_SUCCESS, NOT_FOUND, NO_DATA_RESTORE } = responseMessage;
@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
    private productHelper: ProductHelper,
  ) {}

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
              AND: [{ categoryId: category.id }, { isDelete: { equals: false } }, { status: ERecordStatus.ACTIVE }],
            },
            orderBy: [
              { totalPrice: utils.getSortBy(sortBy) ?? 'asc' },
              { updatedAt: utils.getSortBy(sortBy) ?? 'asc' },
            ],
            select: {
              ...this.productHelper.getSelectFields(langCode, { hasCate, hasLike, convertLang: true }),
            },
          });
          const convertProducts = this.productHelper.convertCollection(products, langCode);
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
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }, { totalPrice: utils.getSortBy(sortBy) ?? 'asc' }],
      select: { ...this.productHelper.getSelectFields(langCode, { hasCate, hasLike, convertLang: true }) },
    });

    if (keywords) {
      const filterProducts = products.filter((product) =>
        langCode === ELang.EN
          ? product.nameEn.toLowerCase().includes(keywords.toLowerCase())
          : product.nameVn.toLowerCase().includes(keywords.toLowerCase()),
      );
      collection = utils.paging<Product>(filterProducts, page, limit);
    } else collection = utils.paging<Product>(products, page, limit);
    const items = this.productHelper.convertCollection(collection.items, langCode);
    return { ...collection, items };
  }

  async getProduct(query: QueryDto) {
    const { productId, langCode, hasCate, hasLike, convertLang } = query;
    const product = await this.prisma.product.findUnique({
      where: { id: productId, isDelete: { equals: false } },
      select: {
        ...this.productHelper.getSelectFields(langCode, { hasCate, hasLike, convertLang }),
        rates: true,
      },
    });
    const response = {
      ...product,
      totalVoted: product.rates.length,
      point: this.productHelper.getRatePoints(product.rates),
    };
    delete response.rates;
    const convertResponse = {
      ...utils.convertRecordsName<Product>({ ...response }, langCode),
      ...this.productHelper.convertDescription<Product>({ ...response }, langCode),
      category:
        'category' in response
          ? { ...utils.convertRecordsName<Category>(response.category as Category, langCode) }
          : null,
    };
    delete convertResponse['descriptionEn'];
    delete convertResponse['descriptionVn'];
    return convertLang ? convertResponse : response;
  }

  async createProduct(file: Express.Multer.File, product: ProductDto) {
    const {
      nameEn,
      nameVn,
      descriptionEn,
      descriptionVn,
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
        descriptionEn,
        descriptionVn,
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
    throw new HttpException(CREATE_ERROR, HttpStatus.BAD_REQUEST);
  }

  async updateProduct(query: QueryDto, file: Express.Multer.File, product: ProductDto) {
    const { productId } = query;
    const {
      nameEn,
      nameVn,
      descriptionEn,
      descriptionVn,
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
        descriptionEn,
        descriptionVn,
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

    throw new HttpException(UPDATE_SUCCESS, HttpStatus.OK);
  }

  async removeProducts(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const products = await this.prisma.product.findMany({
      where: { id: { in: listIds } },
      select: { id: true, image: true, comments: true, rates: true, likes: true },
    });
    if (products && !products.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.product.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    await Promise.all(
      products.map(async (product) => {
        if (product.image) await this.productHelper.handleUpdateIsDeleteProductImage(product, true);
        if (product.comments.length > 0) await this.productHelper.handleUpdateIsDeleteProductComment(product, true);
        if (product.rates.length > 0) await this.productHelper.handleUpdateIsDeleteProductRate(product, true);
        if (product.likes.length > 0) await this.productHelper.handleUpdateIsDeleteProductLike(product, true);
      }),
    );
    throw new HttpException(REMOVE_SUCCESS, HttpStatus.OK);
  }

  async removeProductsPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const products = await this.prisma.product.findMany({
      where: { id: { in: listIds } },
      include: { image: true },
    });
    if (products && !products.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.product.deleteMany({ where: { id: { in: listIds } } });
    await Promise.all(
      products.map(async (product) => {
        if (!product.image) return;
        await this.cloudinary.destroy(product.image.publicId);
      }),
    );
    throw new HttpException(REMOVE_SUCCESS, HttpStatus.OK);
  }

  async restoreProducts() {
    const products = await this.prisma.product.findMany({
      where: { isDelete: { equals: true } },
      select: { id: true, image: true, comments: true, rates: true, likes: true },
    });
    if (products && !products.length) throw new HttpException(NO_DATA_RESTORE, HttpStatus.OK);
    await Promise.all(
      products.map(async (product) => {
        await this.productHelper.handleRestoreProduct(product);
        if (product.image) await this.productHelper.handleUpdateIsDeleteProductImage(product, false);
        if (product.comments.length > 0) await this.productHelper.handleUpdateIsDeleteProductComment(product, false);
        if (product.rates.length > 0) await this.productHelper.handleUpdateIsDeleteProductRate(product, false);
        if (product.likes.length > 0) await this.productHelper.handleUpdateIsDeleteProductLike(product, false);
      }),
    );
    throw new HttpException(RESTORE_SUCCESS, HttpStatus.OK);
  }
}
