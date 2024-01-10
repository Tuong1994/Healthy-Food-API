import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { PrismaService } from '../prisma/prisma.service';
import { CheckIdMiddleware } from 'src/common/middleware/checkId.middleware';

@Module({
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(new CheckIdMiddleware(this.prisma, 'like').use).forRoutes(
      {
        path: 'api/like/detail',
        method: RequestMethod.GET,
      },
      {
        path: 'api/like/update',
        method: RequestMethod.POST,
      },
    );
  }
}
