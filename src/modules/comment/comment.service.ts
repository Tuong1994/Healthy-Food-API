import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging, List } from 'src/common/type/base';
import { Comment, Product } from '@prisma/client';
import { CommentDto } from './comment.dto';
import { ELang } from 'src/common/enum/base';
import utils from 'src/utils';

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
      include: { user: { select: { fullName: true, image: true } } },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
    });
    if (comments && comments.length > 0) {
      const totalItems = comments.length;
      const items = comments.slice(0, Number(limit));
      collection = { totalItems, items };
    }
    return collection;
  }

  async getCommentsByUser(query: QueryDto) {
    const { page, limit, userId, sortBy, langCode } = query;
    let collection: Paging<Comment> = utils.defaultCollection();
    const comments = await this.prisma.comment.findMany({
      where: { userId, isDelete: { equals: false } },
      include: { product: { select: { ...this.getSelectProductFields(langCode) } } },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
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
    const { content, userId, productId, parentId } = comment;
    const newComment = await this.prisma.comment.create({
      data: { content, userId, productId, parentId, isDelete: false },
    });
    return newComment;
  }

  async updateComment(query: QueryDto, comment: CommentDto) {
    const { commentId } = query;
    const { content, userId, productId, parentId } = comment;
    await this.prisma.comment.update({
      where: { id: commentId },
      data: { content, userId, productId, parentId },
    });
    throw new HttpException('Updated success', HttpStatus.OK);
  }

  async removeComments(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const comments = await this.prisma.comment.findMany({ where: { id: { in: listIds } } });
    if (comments && !comments.length) throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    await this.prisma.comment.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    throw new HttpException('Removed success', HttpStatus.OK);
  }

  async removeCommentsPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const comments = await this.prisma.comment.findMany({ where: { id: { in: listIds } } });
    if (comments && !comments.length) throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    await this.prisma.comment.deleteMany({ where: { id: { in: listIds } } });
    throw new HttpException('Removed success', HttpStatus.OK);
  }

  async restoreComments() {
    const comments = await this.prisma.comment.findMany({ where: { isDelete: { equals: true } } });
    if (comments && !comments.length) throw new HttpException('There are no data to restored', HttpStatus.OK);
    await Promise.all(
      comments.map(async (comment) => {
        await this.prisma.comment.update({ where: { id: comment.id }, data: { isDelete: false } });
      }),
    );
    throw new HttpException('Restored success', HttpStatus.OK);
  }
}
