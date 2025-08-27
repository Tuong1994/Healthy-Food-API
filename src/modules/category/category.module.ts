import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryHelper } from './category.helper';
import { applyCheckIdMiddleware } from 'src/common/middleware/applyFn.middleware';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryHelper],
})
export class CategoryModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    applyCheckIdMiddleware({
      consumer,
      prisma: this.prisma,
      schema: 'category',
      routes: [
        {
          path: 'api/category/detail',
          method: RequestMethod.GET,
        },
        {
          path: 'api/category/update',
          method: RequestMethod.PUT,
        },
      ],
    });
  }
}
