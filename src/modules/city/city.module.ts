import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { PrismaService } from '../prisma/prisma.service';
import { CheckIdMiddleware } from 'src/common/middleware/checkId.middleware';

@Module({
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(new CheckIdMiddleware(this.prisma, 'city').use).forRoutes(
      {
        path: 'api/city/detail',
        method: RequestMethod.GET,
      },
      {
        path: 'api/city/update',
        method: RequestMethod.PUT,
      },
    );
  }
}
