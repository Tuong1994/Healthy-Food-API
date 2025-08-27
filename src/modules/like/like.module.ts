import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { PrismaService } from '../prisma/prisma.service';
import { applyCheckIdMiddleware } from 'src/common/middleware/applyFn.middleware';

@Module({
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    applyCheckIdMiddleware({
      consumer,
      prisma: this.prisma,
      schema: 'like',
      routes: [
        {
          path: 'api/like/detail',
          method: RequestMethod.GET,
        },
        {
          path: 'api/like/update',
          method: RequestMethod.POST,
        },
      ],
    });
  }
}
