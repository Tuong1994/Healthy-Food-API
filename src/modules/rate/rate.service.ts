import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { Product, Rate } from '@prisma/client';
import { RateDto } from './rate.dto';
import { ELang } from 'src/common/enum/base';
import utils from 'src/utils';

@Injectable()
export class RateService {
  constructor(private prisma: PrismaService) {}

  private getSelectProductFields(langCode: ELang) {
    return {
      image: true,
      nameEn: langCode === ELang.EN,
      nameVn: langCode === ELang.VN,
    };
  }

  private convertCollection(comments: Rate[], langCode: ELang) {
    return comments.map((comment) => ({
      ...comment,
      product:
        'product' in comment ? utils.convertRecordsName<Product>(comment.product as Product, langCode) : null,
    }));
  }

  async getRates(query: QueryDto) {
    const { page, limit, customerId, productId, langCode } = query;
    let collection: Paging<Rate> = utils.defaultCollection();
    const rates = await this.prisma.rate.findMany({
      where: { AND: [{ customerId }, { productId }, { isDelete: { equals: false } }] },
      include: { product: { select: { ...this.getSelectProductFields(langCode) } } },
    });
    if (rates && rates.length > 0) collection = utils.paging<Rate>(rates, page, limit);
    const items = this.convertCollection(collection.items, langCode);
    return { ...collection, items };
  }

  async getRatesByCustomer(query: QueryDto) {
    const { page, limit, customerId } = query;
    let collection: Paging<Rate> = utils.defaultCollection();
    const rates = await this.prisma.rate.findMany({ where: { customerId, isDelete: { equals: false } } });
    if (rates && rates.length > 0) collection = utils.paging<Rate>(rates, page, limit);
    return collection;
  }

  async getRate(query: QueryDto) {
    const { rateId } = query;
    const rate = await this.prisma.rate.findUnique({ where: { id: rateId, isDelete: { equals: false } } });
    return rate;
  }

  async createRate(rate: RateDto) {
    const { point, customerId, productId, note } = rate;
    const newRate = await this.prisma.rate.create({
      data: { point, customerId, productId, note, isDelete: false },
    });
    return newRate;
  }

  async updateRate(query: QueryDto, rate: RateDto) {
    const { rateId } = query;
    const { point, customerId, productId, note } = rate;
    await this.prisma.rate.update({
      where: { id: rateId },
      data: { point, customerId, productId, note },
    });
    throw new HttpException('Updated success', HttpStatus.OK);
  }

  async removeRates(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const rates = await this.prisma.rate.findMany({ where: { id: { in: listIds } } });
    if (rates && rates.length > 0) {
      await this.prisma.rate.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
      throw new HttpException('Removed success', HttpStatus.OK);
    }
    throw new HttpException('Rate not found', HttpStatus.NOT_FOUND);
  }

  async removeRatesPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const rates = await this.prisma.rate.findMany({ where: { id: { in: listIds } } });
    if (rates && rates.length > 0) {
      await this.prisma.rate.deleteMany({ where: { id: { in: listIds } } });
      throw new HttpException('Removed success', HttpStatus.OK);
    }
    throw new HttpException('Rate not found', HttpStatus.NOT_FOUND);
  }

  async restoreRates() {
    await this.prisma.rate.updateMany({ data: { isDelete: false } });
    throw new HttpException('Restored success', HttpStatus.OK);
  }
}
