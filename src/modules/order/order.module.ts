import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaService } from '../prisma/prisma.service';
import { OrderHelper } from './order.helper';
import { applyCheckIdMiddleware } from 'src/common/middleware/applyFn.middleware';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderHelper],
})
export class OrderModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    applyCheckIdMiddleware({
      consumer,
      prisma: this.prisma,
      schema: 'order',
      routes: [
        {
          path: 'api/order/listByUser',
          method: RequestMethod.GET,
        },
        {
          path: 'api/order/detail',
          method: RequestMethod.GET,
        },
        {
          path: 'api/order/update',
          method: RequestMethod.PUT,
        },
      ],
    });
  }
}
