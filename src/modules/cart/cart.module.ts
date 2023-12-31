import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { PrismaService } from '../prisma/prisma.service';
import { CheckIdMiddleware } from 'src/common/middleware/checkId.middleware';

@Module({
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(new CheckIdMiddleware(this.prisma, 'cart').use).forRoutes(
      {
        path: 'api/cart/detail',
        method: RequestMethod.GET,
      },
      {
        path: 'api/cart/update',
        method: RequestMethod.PUT,
      },
    );
  }
}
