import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProductHelper } from './product.helper';
import { applyCheckIdMiddleware } from 'src/common/middleware/applyFn.middleware';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductHelper],
})
export class ProductModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    applyCheckIdMiddleware(consumer, this.prisma, {
      type: 'product',
      route: 'api/product/detail',
      method: RequestMethod.GET,
    });
    applyCheckIdMiddleware(consumer, this.prisma, {
      type: 'product',
      route: 'api/product/update',
      method: RequestMethod.PUT,
    });
  }
}
