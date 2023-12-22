import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { District } from '@prisma/client';
import { DistrictDto } from './district.dto';
import helper from 'src/helper';
import utils from 'src/utils';

@Injectable()
export class DistrictService {
  constructor(private prisma: PrismaService) {}

  async getDistricts(query: QueryDto) {
    const { keywords, sortBy, langCode } = query;
    const districts = await this.prisma.district.findMany({
      where: { langCode },
      orderBy: [{ updatedAt: helper.getSortBy(sortBy) ?? 'desc' }],
    });
    if (keywords)
      return districts.filter((district) => district.name.toLowerCase().includes(keywords.toLowerCase()));
    return districts;
  }

  async getDistrictsPaging(query: QueryDto) {
    const { page, limit, keywords, sortBy, langCode } = query;
    let collection: Paging<District> = utils.defaultCollection();
    const districts = await this.prisma.district.findMany({
      where: { langCode },
      orderBy: [{ updatedAt: helper.getSortBy(sortBy) ?? 'desc' }],
    });
    if (keywords) {
      const filterDistricts = districts.filter((district) =>
        district.name.toLowerCase().includes(keywords.toLowerCase()),
      );
      collection = utils.paging<District>(filterDistricts, page, limit);
    } else collection = utils.paging<District>(districts, page, limit);

    return collection;
  }

  async getDistrict(query: QueryDto) {
    const { districtId } = query;
    const district = await this.prisma.district.findUnique({ where: { id: districtId } });
    return district;
  }

  async createDistrict(district: DistrictDto) {
    const { name, code, cityCode, langCode } = district;
    const newDistrict = await this.prisma.district.create({
      data: { name, code: Number(code), cityCode: Number(cityCode), langCode },
    });
    return newDistrict;
  }

  async updateDistrict(query: QueryDto, district: DistrictDto) {
    const { districtId } = query;
    const { name, code, cityCode, langCode } = district;
    await this.prisma.district.update({
      where: { id: districtId },
      data: { name, code, cityCode, langCode },
    });
    throw new HttpException('Updated success', HttpStatus.OK);
  }

  async removeDistricts(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const districts = await this.prisma.district.findMany({ where: { id: { in: listIds } } });
    if (districts && districts.length > 0) {
      await this.prisma.district.deleteMany({ where: { id: { in: listIds } } });
      throw new HttpException('Removed success', HttpStatus.OK);
    }
    throw new HttpException('District not found', HttpStatus.NOT_FOUND);
  }
}
