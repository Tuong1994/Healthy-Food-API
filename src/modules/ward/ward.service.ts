import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { Ward } from '@prisma/client';
import { WardDto } from './ward.dto';
import helper from 'src/helper';
import utils from 'src/utils';

@Injectable()
export class WardService {
  constructor(private prisma: PrismaService) {}

  async getWards(query: QueryDto) {
    const { keywords, sortBy, langCode } = query;
    const wards = await this.prisma.ward.findMany({
      where: { langCode },
      orderBy: [{ updatedAt: helper.getSortBy(sortBy) ?? 'desc' }],
    });
    if (keywords) return wards.filter((ward) => ward.name.toLowerCase().includes(keywords.toLowerCase()));
    return wards;
  }

  async getWardsPaging(query: QueryDto) {
    const { page, limit, keywords, sortBy, langCode } = query;
    let collection: Paging<Ward> = utils.defaultCollection();
    const wards = await this.prisma.ward.findMany({
      where: { langCode },
      orderBy: [{ updatedAt: helper.getSortBy(sortBy) ?? 'desc' }],
    });
    if (keywords) {
      const filterWards = wards.filter((ward) => ward.name.toLowerCase().includes(keywords.toLowerCase()));
      collection = utils.paging<Ward>(filterWards, page, limit);
    } else collection = utils.paging<Ward>(wards, page, limit);

    return collection;
  }

  async getWad(query: QueryDto) {
    const { wardId } = query;
    const ward = await this.prisma.ward.findUnique({ where: { id: wardId } });
    return ward;
  }

  async createWard(ward: WardDto) {
    const { name, code, districtCode, langCode } = ward;
    const newWard = await this.prisma.ward.create({ data: { name, code, districtCode, langCode } });
    return newWard;
  }

  async updateWard(query: QueryDto, ward: WardDto) {
    const { wardId } = query;
    const { name, code, districtCode, langCode } = ward;
    await this.prisma.ward.update({ where: { id: wardId }, data: { name, code, districtCode, langCode } });
    throw new HttpException('Updated success', HttpStatus.OK);
  }

  async removeWards(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const wards = await this.prisma.ward.findMany({ where: { id: { in: listIds } } });
    if (wards && wards.length > 0) {
      await this.prisma.ward.deleteMany({ where: { id: { in: listIds } } });
      throw new HttpException('Removed success', HttpStatus.OK);
    }
    throw new HttpException('Ward not found', HttpStatus.NOT_FOUND);
  }
}
