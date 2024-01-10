import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { Like } from '@prisma/client';
import utils from 'src/utils';
import helper from 'src/helper';
import { LikeDto } from './like.dto';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async getLikes(query: QueryDto) {
    const { page, limit, sortBy } = query;
    let collection: Paging<Like> = utils.defaultCollection();
    const likes = await this.prisma.like.findMany({
      where: { isDelete: { equals: false } },
      orderBy: [{ updatedAt: helper.getSortBy(sortBy) ?? 'desc' }],
    });
    collection = utils.paging<Like>(likes, page, limit);
    return collection;
  }

  async getLike(query: QueryDto) {
    const { likeId } = query;
    const like = await this.prisma.like.findUnique({
      where: { id: likeId, isDelete: { equals: false } },
      include: { customer: true, product: true },
    });
    return like;
  }

  async createLike(like: LikeDto) {
    const { customerId, productId } = like;
    const newLike = await this.prisma.like.create({ data: { customerId, productId, isDelete: false } });
    return newLike;
  }

  async updateLike(query: QueryDto, like: LikeDto) {
    const { likeId } = query;
    const { customerId, productId } = like;
    await this.prisma.like.update({ where: { id: likeId }, data: { customerId, productId } });
    throw new HttpException('Updated success', HttpStatus.OK);
  }

  async removeLikes(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const likes = await this.prisma.like.findMany({ where: { id: { in: listIds } } });
    if (likes && likes.length > 0) {
      await this.prisma.like.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    }
    throw new HttpException('Like not found', HttpStatus.NOT_FOUND);
  }

  async removeLikesPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const likes = await this.prisma.like.findMany({ where: { id: { in: listIds } } });
    if (likes && likes.length > 0) {
      await this.prisma.like.deleteMany({ where: { id: { in: listIds } } });
    }
    throw new HttpException('Like not found', HttpStatus.NOT_FOUND);
  }

  async restoreLikes() {
    await this.prisma.like.updateMany({ data: { isDelete: false } });
    throw new HttpException('Restored success', HttpStatus.OK);
  }
}
