import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { District } from '@prisma/client';
import { DistrictDto } from './district.dto';
import { ELang } from 'src/common/enum/base';
import utils from 'src/utils';

@Injectable()
export class DistrictService {
  constructor(private prisma: PrismaService) {}

  private getSelectFields(langCode: ELang) {
    return {
      id: true,
      nameEn: langCode === ELang.EN,
      nameVn: langCode === ELang.VN,
      code: true,
      cityCode: true,
      isDelete: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  private convertCollection(districts: District[], langCode: ELang) {
    return districts.map((district) => ({
      ...utils.convertRecordsName<District>(district, langCode),
    }));
  }

  async getDistricts(query: QueryDto) {
    const { keywords, sortBy, langCode, cityCode } = query;
    const districts = await this.prisma.district.findMany({
      where: { AND: [{ cityCode: cityCode && Number(cityCode) }, { isDelete: { equals: false } }] },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      select: { ...this.getSelectFields(langCode) },
    });
    let filterDistricts: District[] = [];
    if (keywords)
      filterDistricts = districts.filter((district) =>
        langCode === ELang.EN
          ? district.nameEn.toLowerCase().includes(keywords.toLowerCase())
          : district.nameVn.toLowerCase().includes(keywords.toLowerCase()),
      );
    const items = this.convertCollection(keywords ? filterDistricts : districts, langCode);
    return { totalItems: keywords ? filterDistricts.length : districts.length, items };
  }

  async getDistrictsPaging(query: QueryDto) {
    const { page, limit, keywords, sortBy, langCode, cityCode } = query;
    let collection: Paging<District> = utils.defaultCollection();
    const districts = await this.prisma.district.findMany({
      where: { AND: [{ cityCode: cityCode && Number(cityCode) }, { isDelete: { equals: false } }] },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      select: { ...this.getSelectFields(langCode) },
    });
    if (keywords) {
      const filterDistricts = districts.filter((district) =>
        langCode === ELang.EN
          ? district.nameEn.toLowerCase().includes(keywords.toLowerCase())
          : district.nameVn.toLowerCase().includes(keywords.toLowerCase()),
      );
      collection = utils.paging<District>(filterDistricts, page, limit);
    } else collection = utils.paging<District>(districts, page, limit);
    const items = this.convertCollection(collection.items, langCode);
    return { ...collection, items };
  }

  async getDistrict(query: QueryDto) {
    const { districtId, langCode } = query;
    const district = await this.prisma.district.findUnique({
      where: { id: districtId, isDelete: { equals: false } },
      select: { ...this.getSelectFields(langCode) },
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
    throw new HttpException('Updated success', HttpStatus.OK);
  }

  async removeDistricts(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const districts = await this.prisma.district.findMany({ where: { id: { in: listIds } } });
    if (districts && !districts.length) throw new HttpException('District not found', HttpStatus.NOT_FOUND);
    await this.prisma.district.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    throw new HttpException('Removed success', HttpStatus.OK);
  }

  async removeDistrictsPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const districts = await this.prisma.district.findMany({ where: { id: { in: listIds } } });
    if (districts && !districts.length) throw new HttpException('District not found', HttpStatus.NOT_FOUND);
    await this.prisma.district.deleteMany({ where: { id: { in: listIds } } });
    throw new HttpException('Removed success', HttpStatus.OK);
  }

  async restoreDistricts() {
    const districts = await this.prisma.district.findMany({ where: { isDelete: { equals: true } } });
    if (districts && !districts.length)
      throw new HttpException('There are no data to restored', HttpStatus.OK);
    await Promise.all(
      districts.map(async (district) => {
        await this.prisma.district.update({ where: { id: district.id }, data: { isDelete: false } });
      }),
    );
    throw new HttpException('Restored success', HttpStatus.OK);
  }
}
