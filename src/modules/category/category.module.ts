import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { PrismaService } from '../prisma/prisma.service';
import { CheckIdMiddleware } from 'src/common/middleware/checkId.middleware';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    const model = this.prisma.category;
    consumer.apply(new CheckIdMiddleware(model).use).forRoutes(
      {
        path: 'api/category/detail',
        method: RequestMethod.GET,
      },
      {
        path: 'api/category/update',
        method: RequestMethod.PUT,
      },
    );
  }
}
