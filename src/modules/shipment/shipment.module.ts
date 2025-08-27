import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ShipmentController } from './shipment.controller';
import { ShipmentService } from './shipment.service';
import { PrismaService } from '../prisma/prisma.service';
import { applyCheckIdMiddleware } from 'src/common/middleware/applyFn.middleware';

@Module({
  controllers: [ShipmentController],
  providers: [ShipmentService],
})
export class ShipmentModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    applyCheckIdMiddleware({
      consumer,
      prisma: this.prisma,
      schema: 'shipment',
      routes: [
        {
          path: 'api/shipment/detail',
          method: RequestMethod.GET,
        },
        {
          path: 'api/shipment/update',
          method: RequestMethod.PUT,
        },
      ],
    });
  }
}
