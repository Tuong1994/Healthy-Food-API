import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { RateController } from './rate.controller';
import { RateService } from './rate.service';
import { PrismaService } from '../prisma/prisma.service';
import { CheckIdMiddleware } from 'src/common/middleware/checkId.middleware';

@Module({
  controllers: [RateController],
  providers: [RateService],
})
export class RateModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    const model = this.prisma.rate;
    consumer.apply(new CheckIdMiddleware(model).use).forRoutes(
      {
        path: 'api/rate/detail',
        method: RequestMethod.GET,
      },
      {
        path: 'api/rate/update',
        method: RequestMethod.PUT,
      },
    );
  }
}
