import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaService } from '../prisma/prisma.service';
import { CheckIdMiddleware } from 'src/common/middleware/checkId.middleware';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(new CheckIdMiddleware(this.prisma, 'order').use).forRoutes(
      {
        path: 'api/order/listByCustomer',
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
    );
  }
}
