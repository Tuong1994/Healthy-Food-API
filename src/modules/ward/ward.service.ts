import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { Ward } from '@prisma/client';
import { WardDto } from './ward.dto';
import { ELang } from 'src/common/enum/base';
import helper from 'src/helper';
import utils from 'src/utils';

@Injectable()
export class WardService {
  constructor(private prisma: PrismaService) {}

  private getSelectFields(langCode: ELang) {
    return {
      id: true,
      nameEn: langCode === ELang.EN,
      nameVn: langCode === ELang.VN,
      code: true,
      districtCode: true,
      isDelete: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  private convertCollection(wards: Ward[], langCode: ELang) {
    return wards.map((ward) => ({
      ...utils.convertRecordsName<Ward>(ward, langCode),
    }));
  }

  async getWards(query: QueryDto) {
    const { keywords, sortBy, langCode, districtCode } = query;
    const wards = await this.prisma.ward.findMany({
      where: { districtCode, isDelete: { equals: false } },
      orderBy: [{ updatedAt: helper.getSortBy(sortBy) ?? 'desc' }],
      select: { ...this.getSelectFields(langCode) },
    });
    let filterWards: Ward[] = [];
    if (keywords)
      filterWards = wards.filter((ward) =>
        langCode === ELang.EN
          ? ward.nameEn.toLowerCase().includes(keywords.toLowerCase())
          : ward.nameVn.toLowerCase().includes(keywords.toLowerCase()),
      );
    const items = this.convertCollection(keywords ? filterWards : wards, langCode);
    return { totalItems: keywords ? filterWards.length : wards.length, items };
  }

  async getWardsPaging(query: QueryDto) {
    const { page, limit, keywords, sortBy, langCode, districtCode } = query;
    let collection: Paging<Ward> = utils.defaultCollection();
    const wards = await this.prisma.ward.findMany({
      where: { districtCode, isDelete: { equals: false } },
      orderBy: [{ updatedAt: helper.getSortBy(sortBy) ?? 'desc' }],
      select: { ...this.getSelectFields(langCode) },
    });
    if (keywords) {
      const filterWards = wards.filter((ward) =>
        langCode === ELang.EN
          ? ward.nameEn.toLowerCase().includes(keywords.toLowerCase())
          : ward.nameVn.toLowerCase().includes(keywords.toLowerCase()),
      );
      collection = utils.paging<Ward>(filterWards, page, limit);
    } else collection = utils.paging<Ward>(wards, page, limit);
    const items = this.convertCollection(collection.items, langCode);
    return { ...collection, items };
  }

  async getWard(query: QueryDto) {
    const { wardId, langCode } = query;
    const ward = await this.prisma.ward.findUnique({
      where: { id: wardId, isDelete: { equals: false } },
      select: { ...this.getSelectFields(langCode) },
    });
    return utils.convertRecordsName<Ward>(ward, langCode);
  }

  async createWard(ward: WardDto) {
    const { nameEn, nameVn, code, districtCode } = ward;
    const newWard = await this.prisma.ward.create({
      data: { nameEn, nameVn, code, districtCode, isDelete: false },
    });
    return newWard;
  }

  async updateWard(query: QueryDto, ward: WardDto) {
    const { wardId } = query;
    const { nameEn, nameVn, code, districtCode } = ward;
    await this.prisma.ward.update({
      where: { id: wardId },
      data: { nameEn, nameVn, code, districtCode },
    });
    throw new HttpException('Updated success', HttpStatus.OK);
  }

  async removeWards(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const wards = await this.prisma.ward.findMany({ where: { id: { in: listIds } } });
    if (wards && wards.length > 0) {
      await this.prisma.ward.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
      throw new HttpException('Removed success', HttpStatus.OK);
    }
    throw new HttpException('Ward not found', HttpStatus.NOT_FOUND);
  }

  async removeWardsPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const wards = await this.prisma.ward.findMany({ where: { id: { in: listIds } } });
    if (wards && wards.length > 0) {
      await this.prisma.ward.deleteMany({ where: { id: { in: listIds } } });
      throw new HttpException('Removed success', HttpStatus.OK);
    }
    throw new HttpException('Ward not found', HttpStatus.NOT_FOUND);
  }

  async restoreWards() {
    await this.prisma.ward.updateMany({ data: { isDelete: false } });
    throw new HttpException('Restored success', HttpStatus.OK);
  }
}
