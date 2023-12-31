import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ShipmentController } from './shipment.controller';
import { ShipmentService } from './shipment.service';
import { PrismaService } from '../prisma/prisma.service';
import { CheckIdMiddleware } from 'src/common/middleware/checkId.middleware';

@Module({
  controllers: [ShipmentController],
  providers: [ShipmentService],
})
export class ShipmentModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(new CheckIdMiddleware(this.prisma, 'shipment').use).forRoutes(
      {
        path: 'api/shipment/detail',
        method: RequestMethod.GET,
      },
      {
        path: 'api/shipment/update',
        method: RequestMethod.PUT,
      },
    );
  }
}
