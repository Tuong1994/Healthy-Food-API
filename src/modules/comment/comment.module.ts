import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { PrismaService } from '../prisma/prisma.service';
import { CheckIdMiddleware } from 'src/common/middleware/checkId.middleware';

@Module({
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(new CheckIdMiddleware(this.prisma, 'comment').use).forRoutes(
      {
        path: 'api/comment/detail',
        method: RequestMethod.GET,
      },
      {
        path: 'api/comment/update',
        method: RequestMethod.PUT,
      },
    );
  }
}
