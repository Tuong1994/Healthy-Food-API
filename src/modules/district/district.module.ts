import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { DistrictController } from './district.controller';
import { DistrictService } from './district.service';
import { PrismaService } from '../prisma/prisma.service';
import { DistrictHelper } from './district.helper';
import { applyCheckIdMiddleware } from 'src/common/middleware/applyFn.middleware';

@Module({
  controllers: [DistrictController],
  providers: [DistrictService, DistrictHelper],
})
export class DistrictModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    applyCheckIdMiddleware({
      consumer,
      prisma: this.prisma,
      schema: 'district',
      routes: [
        {
          path: 'api/district/detail',
          method: RequestMethod.GET,
        },
        {
          path: 'api/district/update',
          method: RequestMethod.PUT,
        },
      ],
    });
  }
}
