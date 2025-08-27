import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { PrismaService } from '../prisma/prisma.service';
import { applyCheckIdMiddleware } from 'src/common/middleware/applyFn.middleware';

@Module({
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    applyCheckIdMiddleware({
      consumer,
      prisma: this.prisma,
      schema: 'comment',
      routes: [
        {
          path: 'api/comment/detail',
          method: RequestMethod.GET,
        },
        {
          path: 'api/comment/update',
          method: RequestMethod.PUT,
        },
      ],
    });
  }
}
