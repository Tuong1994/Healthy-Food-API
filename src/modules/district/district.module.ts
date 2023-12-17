import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { DistrictController } from './district.controller';
import { DistrictService } from './district.service';
import { PrismaService } from '../prisma/prisma.service';
import { CheckIdMiddleware } from 'src/common/middleware/checkId.middleware';

@Module({
  controllers: [DistrictController],
  providers: [DistrictService],
})
export class DistrictModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(new CheckIdMiddleware(this.prisma, 'district').use).forRoutes(
      {
        path: 'api/district/detail',
        method: RequestMethod.GET,
      },
      {
        path: 'api/district/update',
        method: RequestMethod.PUT,
      },
    );
  }
}
