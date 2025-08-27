import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { PrismaService } from '../prisma/prisma.service';
import { CityHelper } from './city.helper';
import { applyCheckIdMiddleware } from 'src/common/middleware/applyFn.middleware';

@Module({
  controllers: [CityController],
  providers: [CityService, CityHelper],
})
export class CityModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    applyCheckIdMiddleware({
      consumer,
      prisma: this.prisma,
      schema: 'city',
      routes: [
        {
          path: 'api/city/detail',
          method: RequestMethod.GET,
        },
        {
          path: 'api/city/update',
          method: RequestMethod.PUT,
        },
      ],
    });
  }
}
