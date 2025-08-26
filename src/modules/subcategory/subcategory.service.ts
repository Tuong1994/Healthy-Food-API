import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { SubCategory } from '@prisma/client';
import { SubCategoryDto } from './subcategory.dto';
import { SubCategoryHelper } from './subcategory.helper';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ELang, ERecordStatus } from 'src/common/enum/base';
import responseMessage from 'src/common/message';
import utils from 'src/utils';

const { CREATE_ERROR, UPDATE_SUCCESS, REMOVE_SUCCESS, RESTORE_SUCCESS, NOT_FOUND, NO_DATA_RESTORE } =
  responseMessage;

@Injectable()
export class SubCategoryService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
    private subCategoryHelper: SubCategoryHelper,
  ) {}

  private queryFiler = (categoryId: string, subCateStatus: ERecordStatus) => [
    { categoryId },
    { isDelete: { equals: false } },
    subCateStatus
      ? Number(subCateStatus) !== ERecordStatus.ALL
        ? { status: Number(subCateStatus) }
        : {}
      : { status: ERecordStatus.ACTIVE },
  ];

  async getSubCategories(query: QueryDto) {
    const { keywords, sortBy, categoryId, langCode, hasCate, subCateStatus } = query;
    const subCategories = await this.prisma.subCategory.findMany({
      where: { AND: this.queryFiler(categoryId, subCateStatus) },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      select: { ...this.subCategoryHelper.getSelectFields(langCode, { hasCate }) },
    });
    let filterSubCategories: SubCategory[] = [];
    if (keywords)
      filterSubCategories = subCategories.filter((subCategory) =>
        langCode === ELang.EN
          ? utils.filterByKeywords(subCategory.nameEn, keywords)
          : utils.filterByKeywords(subCategory.nameVn, keywords),
      );
    const items = this.subCategoryHelper.convertCollection(
      keywords ? filterSubCategories : subCategories,
      langCode,
    );
    return { totalItems: keywords ? filterSubCategories.length : subCategories.length, items };
  }

  async getSubCategoriesPaging(query: QueryDto) {
    const { page, limit, keywords, sortBy, categoryId, langCode, subCateStatus } = query;
    let collection: Paging<SubCategory> = utils.defaultCollection();
    const subCategories = await this.prisma.subCategory.findMany({
      where: { AND: this.queryFiler(categoryId, subCateStatus) },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      select: { ...this.subCategoryHelper.getSelectFields(langCode, { hasCate: true }) },
    });
    if (keywords) {
      const filterSubCategories = subCategories.filter((subCategory) =>
        langCode === ELang.EN
          ? utils.filterByKeywords(subCategory.nameEn, keywords)
          : utils.filterByKeywords(subCategory.nameVn, keywords),
      );
      collection = utils.paging<SubCategory>(filterSubCategories, page, limit);
    } else collection = utils.paging<SubCategory>(subCategories, page, limit);
    const items = this.subCategoryHelper.convertCollection(collection.items, langCode);
    return { ...collection, items };
  }

  async getSubCategory(query: QueryDto) {
    const { subCategoryId, langCode, convertLang } = query;
    const subCategory = await this.prisma.subCategory.findUnique({
      where: { id: subCategoryId, isDelete: { equals: false } },
      select: { ...this.subCategoryHelper.getSelectFields(langCode, { convertLang }) },
    });
    const convertResponse = utils.convertRecordsName<SubCategory>({ ...subCategory }, langCode);
    return convertLang ? convertResponse : subCategory;
  }

  async createSubCategory(file: Express.Multer.File, subCategory: SubCategoryDto) {
    const { nameEn, nameVn, status, categoryId } = subCategory;
    const newSubCategory = await this.prisma.subCategory.create({
      data: { nameEn, nameVn, status: Number(status), categoryId, isDelete: false },
    });
    if (newSubCategory) {
      if (!file) return newSubCategory;
      const result = await this.cloudinary.upload(utils.getFileUrl(file));
      const image = utils.generateImage(result, { subCategoryId: newSubCategory.id });
      await this.prisma.image.create({ data: { ...image, isDelete: false } });
      const resSubCategory = await this.prisma.subCategory.findUnique({ where: { id: newSubCategory.id } });
      return resSubCategory;
    }
    throw new HttpException(CREATE_ERROR, HttpStatus.BAD_REQUEST);
  }

  async updateSubCategory(query: QueryDto, file: Express.Multer.File, subCategory: SubCategoryDto) {
    const { subCategoryId } = query;
    const { nameEn, nameVn, status, categoryId } = subCategory;
    await this.prisma.subCategory.update({
      where: { id: subCategoryId },
      data: { nameEn, nameVn, status: Number(status), categoryId },
    });
    if (file) {
      const updateSubCategory = await this.prisma.subCategory.findUnique({
        where: { id: subCategoryId },
        select: { image: true },
      });
      const result = await this.cloudinary.upload(utils.getFileUrl(file));
      const image = utils.generateImage(result, { subCategoryId });
      if (updateSubCategory.image) {
        await this.cloudinary.destroy(updateSubCategory.image.publicId);
        await this.prisma.image.update({ where: { subCategoryId }, data: image });
      } else {
        await this.prisma.image.create({ data: { ...image, isDelete: false } });
      }
    }
    throw new HttpException(UPDATE_SUCCESS, HttpStatus.OK);
  }

  async removeSubCategories(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const subCategories = await this.prisma.subCategory.findMany({
      where: { id: { in: listIds } },
      select: { ...this.subCategoryHelper.getSelectFields(ELang.EN, {}) },
    });
    if (subCategories && !subCategories.length)
      throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.subCategory.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    await Promise.all(
      subCategories.map(async (subCategory) => {
        if (!subCategory.image) return;
        await this.subCategoryHelper.handleUpdateIsDeleteSubCategoryImage(subCategory, true);
      }),
    );
    throw new HttpException(REMOVE_SUCCESS, HttpStatus.OK);
  }

  async removeSubCategoriesPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const subCategories = await this.prisma.subCategory.findMany({
      where: { id: { in: listIds } },
      include: { image: true },
    });
    if (subCategories && !subCategories.length)
      throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.subCategory.deleteMany({ where: { id: { in: listIds } } });
    await Promise.all(
      subCategories.map(async (subCategory) => {
        if (!subCategory.image) return;
        await this.cloudinary.destroy(subCategory.image.publicId);
      }),
    );
    throw new HttpException(REMOVE_SUCCESS, HttpStatus.OK);
  }

  async restoreSubCategories() {
    const subCategories = await this.prisma.subCategory.findMany({
      where: { isDelete: { equals: true } },
      select: { ...this.subCategoryHelper.getSelectFields(ELang.EN, {}) },
    });
    if (subCategories && !subCategories.length)
      throw new HttpException(NO_DATA_RESTORE, HttpStatus.OK);
    await Promise.all(
      subCategories.map(async (subCategory) => {
        await this.subCategoryHelper.handleRestoreSubCategory(subCategory);
        if (subCategory.image)
          await this.subCategoryHelper.handleUpdateIsDeleteSubCategoryImage(subCategory, false);
      }),
    );

    throw new HttpException(RESTORE_SUCCESS, HttpStatus.OK);
  }
}
