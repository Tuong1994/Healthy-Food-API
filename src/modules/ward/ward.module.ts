import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { WardController } from './ward.controller';
import { WardService } from './ward.service';
import { PrismaService } from '../prisma/prisma.service';
import { WardHelper } from './ward.helper';
import { applyCheckIdMiddleware } from 'src/common/middleware/applyFn.middleware';

@Module({
  controllers: [WardController],
  providers: [WardService, WardHelper],
})
export class WardModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    applyCheckIdMiddleware({
      consumer,
      prisma: this.prisma,
      schema: 'ward',
      routes: [
        {
          path: 'api/ward/detail',
          method: RequestMethod.GET,
        },
        {
          path: 'api/ward/update',
          method: RequestMethod.PUT,
        },
      ],
    });
  }
}
