import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging, List } from 'src/common/type/base';
import { Comment, Product } from '@prisma/client';
import { CommentDto } from './comment.dto';
import { ELang } from 'src/common/enum/base';
import utils from 'src/utils';
import helper from 'src/helper';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  private getSelectProductFields(langCode: ELang) {
    return {
      image: true,
      nameEn: langCode === ELang.EN,
      nameVn: langCode === ELang.VN,
    };
  }

  private convertCollection(comments: Comment[], langCode: ELang) {
    return comments.map((comment) => ({
      ...comment,
      product:
        'product' in comment ? utils.convertRecordsName<Product>(comment.product as Product, langCode) : null,
    }));
  }

  async getComments(query: QueryDto) {
    const { limit, productId, sortBy } = query;
    let collection: List<Comment> = utils.defaultList();
    const comments = await this.prisma.comment.findMany({
      where: { AND: [{ productId }, { isDelete: { equals: false } }] },
      include: { customer: { select: { fullName: true, image: true } } },
      orderBy: [{ updatedAt: helper.getSortBy(sortBy) ?? 'desc' }],
    });
    if (comments && comments.length > 0) {
      const totalItems = comments.length;
      const items = comments.slice(0, Number(limit));
      collection = { totalItems, items };
    }
    return collection;
  }

  async getCommentsByCustomer(query: QueryDto) {
    const { page, limit, customerId, langCode } = query;
    let collection: Paging<Comment> = utils.defaultCollection();
    const comments = await this.prisma.comment.findMany({
      where: { customerId, isDelete: { equals: false } },
      include: { product: { select: { ...this.getSelectProductFields(langCode) } } },
    });
    if (comments && comments.length > 0) collection = utils.paging<Comment>(comments, page, limit);
    const items = this.convertCollection(collection.items, langCode);
    return { ...collection, items };
  }

  async getComment(query: QueryDto) {
    const { commentId } = query;
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId, isDelete: { equals: false } },
    });
    return comment;
  }

  async createComment(comment: CommentDto) {
    const { content, customerId, productId, parentId } = comment;
    const newComment = await this.prisma.comment.create({
      data: { content, customerId, productId, parentId, isDelete: false },
    });
    return newComment;
  }

  async updateComment(query: QueryDto, comment: CommentDto) {
    const { commentId } = query;
    const { content, customerId, productId, parentId } = comment;
    await this.prisma.comment.update({
      where: { id: commentId },
      data: { content, customerId, productId, parentId },
    });
    throw new HttpException('Updated success', HttpStatus.OK);
  }

  async removeComments(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const comments = await this.prisma.comment.findMany({ where: { id: { in: listIds } } });
    if (comments && comments.length > 0) {
      await this.prisma.comment.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
      throw new HttpException('Removed success', HttpStatus.OK);
    }
    throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
  }

  async removeCommentsPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const comments = await this.prisma.comment.findMany({ where: { id: { in: listIds } } });
    if (comments && comments.length > 0) {
      await this.prisma.comment.deleteMany({ where: { id: { in: listIds } } });
      throw new HttpException('Removed success', HttpStatus.OK);
    }
    throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
  }

  async restoreComments() {
    await this.prisma.comment.updateMany({ data: { isDelete: false } });
    throw new HttpException('Restored success', HttpStatus.OK);
  }
}
