import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { Rate } from '@prisma/client';
import { RateDto } from './rate.dto';
import utils from 'src/utils';

@Injectable()
export class RateService {
  constructor(private prisma: PrismaService) {}

  async getRates(query: QueryDto) {
    const { page, limit } = query;
    let collection: Paging<Rate> = utils.defaultCollection();
    const rates = await this.prisma.rate.findMany();
    if (rates && rates.length > 0) collection = utils.paging<Rate>(rates, page, limit);
    return collection;
  }

  async getRate(query: QueryDto) {
    const { rateId } = query;
    const rate = await this.prisma.rate.findUnique({ where: { id: rateId } });
    return rate;
  }

  async createRate(rate: RateDto) {
    const { point, customerId, productId, note } = rate;
    const newRate = await this.prisma.rate.create({
      data: { point, customerId, productId, note },
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
      await this.prisma.rate.deleteMany({ where: { id: { in: listIds } } });
      throw new HttpException('Removed success', HttpStatus.OK);
    }
    throw new HttpException('Rate not found', HttpStatus.NOT_FOUND);
  }
}
