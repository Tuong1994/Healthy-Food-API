import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { Comment } from '@prisma/client';
import { CommentDto } from './comment.dto';
import utils from 'src/utils';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async getComments(query: QueryDto) {
    const { page, limit } = query;
    let collection: Paging<Comment> = utils.defaultCollection();
    const comments = await this.prisma.comment.findMany();
    if (comments && comments.length > 0) collection = utils.paging<Comment>(comments, page, limit);
    return collection;
  }

  async getComment(query: QueryDto) {
    const { commentId } = query;
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
    return comment;
  }

  async createComment(comment: CommentDto) {
    const { content, customerId, productId, parentId } = comment;
    const newComment = await this.prisma.comment.create({
      data: { content, customerId, productId, parentId },
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
      await this.prisma.comment.deleteMany({ where: { id: { in: listIds } } });
      throw new HttpException('Removed success', HttpStatus.OK);
    }
    throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
  }
}
