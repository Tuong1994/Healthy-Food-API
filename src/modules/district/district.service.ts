import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { District } from '@prisma/client';
import { DistrictDto } from './district.dto';
import { ELang } from 'src/common/enum/base';
import helper from 'src/helper';
import utils from 'src/utils';

const getSelectFields = (langCode: ELang) => ({
  id: true,
  nameEn: langCode === ELang.EN,
  nameVn: langCode === ELang.VN,
  code: true,
  cityCode: true,
  isDelete: true,
  createdAt: true,
  updatedAt: true,
});

@Injectable()
export class DistrictService {
  constructor(private prisma: PrismaService) {}

  async getDistricts(query: QueryDto) {
    const { keywords, sortBy, langCode } = query;
    const districts = await this.prisma.district.findMany({
      where: { isDelete: { equals: false } },
      orderBy: [{ updatedAt: helper.getSortBy(sortBy) ?? 'desc' }],
      select: { ...getSelectFields(langCode) },
    });
    if (keywords)
      return districts.filter(
        (district) =>
          district.nameEn.toLowerCase().includes(keywords.toLowerCase()) ||
          district.nameVn.toLowerCase().includes(keywords.toLowerCase()),
      );
    return districts;
  }

  async getDistrictsPaging(query: QueryDto) {
    const { page, limit, keywords, sortBy, langCode } = query;
    let collection: Paging<District> = utils.defaultCollection();
    const districts = await this.prisma.district.findMany({
      where: { isDelete: { equals: false } },
      orderBy: [{ updatedAt: helper.getSortBy(sortBy) ?? 'desc' }],
      select: { ...getSelectFields(langCode) },
    });
    if (keywords) {
      const filterDistricts = districts.filter(
        (district) =>
          district.nameEn.toLowerCase().includes(keywords.toLowerCase()) ||
          district.nameVn.toLowerCase().includes(keywords.toLowerCase()),
      );
      collection = utils.paging<District>(filterDistricts, page, limit);
    } else collection = utils.paging<District>(districts, page, limit);

    return collection;
  }

  async getDistrict(query: QueryDto) {
    const { districtId, langCode } = query;
    const district = await this.prisma.district.findUnique({
      where: { id: districtId, isDelete: { equals: false } },
      select: { ...getSelectFields(langCode) },
    });
    return district;
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
    throw new HttpException('Updated success', HttpStatus.OK);
  }

  async removeDistricts(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const districts = await this.prisma.district.findMany({ where: { id: { in: listIds } } });
    if (districts && districts.length > 0) {
      await this.prisma.district.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
      throw new HttpException('Removed success', HttpStatus.OK);
    }
    throw new HttpException('District not found', HttpStatus.NOT_FOUND);
  }

  async removeDistrictsPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const districts = await this.prisma.district.findMany({ where: { id: { in: listIds } } });
    if (districts && districts.length > 0) {
      await this.prisma.district.deleteMany({ where: { id: { in: listIds } } });
      throw new HttpException('Removed success', HttpStatus.OK);
    }
    throw new HttpException('District not found', HttpStatus.NOT_FOUND);
  }

  async restoreDistricts() {
    await this.prisma.district.updateMany({ data: { isDelete: false } });
    throw new HttpException('Restored success', HttpStatus.OK);
  }
}
