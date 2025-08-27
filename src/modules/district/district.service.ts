import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { District } from '@prisma/client';
import { DistrictDto } from './district.dto';
import { ELang } from 'src/common/enum/base';
import { DistrictHelper } from './district.helper';
import responseMessage from 'src/common/message';
import utils from 'src/utils';

const { UPDATE_SUCCESS, REMOVE_SUCCESS, RESTORE_SUCCESS, NOT_FOUND, NO_DATA_RESTORE } = responseMessage;
@Injectable()
export class DistrictService {
  constructor(
    private prisma: PrismaService,
    private districtHelper: DistrictHelper,
  ) {}

  async getDistricts(query: QueryDto) {
    const { keywords, sortBy, langCode, cityCode } = query;
    const districts = await this.prisma.district.findMany({
      where: { AND: [{ cityCode: cityCode && Number(cityCode) }, { isDelete: { equals: false } }] },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      select: { ...this.districtHelper.getSelectFields(langCode) },
    });
    let filterDistricts: District[] = [];
    if (keywords)
      filterDistricts = districts.filter((district) =>
        langCode === ELang.EN
          ? utils.filterByKeywords(district.nameEn, keywords)
          : utils.filterByKeywords(district.nameVn, keywords),
      );
    const items = this.districtHelper.convertCollection(keywords ? filterDistricts : districts, langCode);
    return { totalItems: keywords ? filterDistricts.length : districts.length, items };
  }

  async getDistrictsPaging(query: QueryDto) {
    const { page, limit, keywords, sortBy, langCode, cityCode } = query;
    let collection: Paging<District> = utils.defaultCollection();
    const districts = await this.prisma.district.findMany({
      where: { AND: [{ cityCode: cityCode && Number(cityCode) }, { isDelete: { equals: false } }] },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      select: { ...this.districtHelper.getSelectFields(langCode) },
    });
    if (keywords) {
      const filterDistricts = districts.filter((district) =>
        langCode === ELang.EN
          ? utils.filterByKeywords(district.nameEn, keywords)
          : utils.filterByKeywords(district.nameVn, keywords),
      );
      collection = utils.paging<District>(filterDistricts, page, limit);
    } else collection = utils.paging<District>(districts, page, limit);
    const items = this.districtHelper.convertCollection(collection.items, langCode);
    return { ...collection, items };
  }

  async getDistrict(query: QueryDto) {
    const { districtId, langCode } = query;
    const district = await this.prisma.district.findUnique({
      where: { id: districtId, isDelete: { equals: false } },
      select: { ...this.districtHelper.getSelectFields(langCode) },
    });
    return utils.convertRecordsName<District>(district, langCode);
  }

  async createDistrict(district: DistrictDto) {
    const { nameEn, nameVn, code, cityCode } = district;
    const newDistrict = await this.prisma.district.create({
      data: { nameEn, nameVn, code, cityCode, isDelete: false },
    });
    return newDistrict;
  }

  async updateDistrict(query: QueryDto, district: DistrictDto) {
    const { districtId } = query;
    const { nameEn, nameVn, code, cityCode } = district;
    await this.prisma.district.update({
      where: { id: districtId },
      data: { nameEn, nameVn, code, cityCode },
    });
    throw new HttpException(UPDATE_SUCCESS, HttpStatus.OK);
  }

  async removeDistricts(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const districts = await this.prisma.district.findMany({ where: { id: { in: listIds } } });
    if (districts && !districts.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.district.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    throw new HttpException(REMOVE_SUCCESS, HttpStatus.OK);
  }

  async removeDistrictsPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const districts = await this.prisma.district.findMany({ where: { id: { in: listIds } } });
    if (districts && !districts.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.district.deleteMany({ where: { id: { in: listIds } } });
    throw new HttpException(REMOVE_SUCCESS, HttpStatus.OK);
  }

  async restoreDistricts() {
    const districts = await this.prisma.district.findMany({ where: { isDelete: { equals: true } } });
    if (districts && !districts.length) throw new HttpException(NO_DATA_RESTORE, HttpStatus.OK);
    await Promise.all(
      districts.map(async (district) => {
        await this.prisma.district.update({ where: { id: district.id }, data: { isDelete: false } });
      }),
    );
    throw new HttpException(RESTORE_SUCCESS, HttpStatus.OK);
  }
}
