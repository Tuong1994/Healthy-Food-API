import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { LikeDto } from './like.dto';
import { Like, Product } from '@prisma/client';
import { Paging } from 'src/common/type/base';
import { ELang } from 'src/common/enum/base';
import responseMessage from 'src/common/message';
import utils from 'src/utils';

const { UPDATE_SUCCESS, REMOVE_SUCCESS, NOT_FOUND } = responseMessage;

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  private getProductSelectFields(langCode: ELang) {
    return {
      id: true,
      nameEn: langCode === ELang.EN,
      nameVn: langCode === ELang.VN,
      image: true,
      unit: true,
      totalPrice: true,
    };
  }

  private convertCollection(likes: Like[], langCode: ELang) {
    return likes.map((like) => ({
      ...like,
      product: 'product' in like ? utils.convertRecordsName<Product>(like.product as Product, langCode) : null,
    }));
  }

  async getLikes(query: QueryDto) {
    const { userId, productId, sortBy, langCode } = query;
    const likes = await this.prisma.like.findMany({
      where: { AND: [{ userId }, { productId }, { isDelete: { equals: false } }] },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      include: { product: { select: { ...this.getProductSelectFields(langCode) } } },
    });
    const items = this.convertCollection(likes, langCode);
    return { totalItems: likes.length, items };
  }

  async getLikesPaging(query: QueryDto) {
    const { page, limit, userId, productId, langCode, sortBy } = query;
    let collection: Paging<Like> = utils.defaultCollection();
    const likes = await this.prisma.like.findMany({
      where: { AND: [{ userId }, { productId }, { isDelete: { equals: false } }] },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      include: { product: { select: { ...this.getProductSelectFields(langCode) } } },
    });
    if (likes && likes.length > 0) collection = utils.paging<Like>(likes, page, limit);
    const items = this.convertCollection(collection.items, langCode);
    return { ...collection, items };
  }

  async getLike(query: QueryDto) {
    const { likeId } = query;
    const like = await this.prisma.like.findUnique({
      where: { id: likeId, isDelete: { equals: false } },
      include: { user: true, product: true },
    });
    return like;
  }

  async createLike(like: LikeDto) {
    const { userId, productId } = like;
    const newLike = await this.prisma.like.create({ data: { userId, productId, isDelete: false } });
    return newLike;
  }

  async updateLike(query: QueryDto, like: LikeDto) {
    const { likeId } = query;
    const { userId, productId } = like;
    await this.prisma.like.update({ where: { id: likeId }, data: { userId, productId } });
    throw new HttpException(UPDATE_SUCCESS, HttpStatus.OK);
  }

  async removeLikes(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const likes = await this.prisma.like.findMany({ where: { id: { in: listIds } } });
    if (likes && !likes.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.like.deleteMany({ where: { id: { in: listIds } } });
    throw new HttpException(REMOVE_SUCCESS, HttpStatus.OK);
  }
}
