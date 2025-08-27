import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { RateController } from './rate.controller';
import { RateService } from './rate.service';
import { PrismaService } from '../prisma/prisma.service';
import { applyCheckIdMiddleware } from 'src/common/middleware/applyFn.middleware';

@Module({
  controllers: [RateController],
  providers: [RateService],
})
export class RateModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    applyCheckIdMiddleware({
      consumer,
      prisma: this.prisma,
      schema: 'rate',
      routes: [
        {
          path: 'api/rate/listByUser',
          method: RequestMethod.GET,
        },
        {
          path: 'api/rate/detail',
          method: RequestMethod.GET,
        },
        {
          path: 'api/rate/update',
          method: RequestMethod.PUT,
        },
      ],
    });
  }
}
