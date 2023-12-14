import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { SubCategoryController } from './subcategory.controller';
import { SubCategoryService } from './subcategory.service';
import { PrismaService } from '../prisma/prisma.service';
import { CheckIdMiddleware } from 'src/common/middleware/checkId.middleware';

@Module({
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
})
export class SubCategoryModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    const model = this.prisma.subCategory;
    consumer.apply(new CheckIdMiddleware(model).use).forRoutes(
      {
        path: 'api/subcategory/detail',
        method: RequestMethod.GET,
      },
      {
        path: 'api/subcategory/update',
        method: RequestMethod.PUT,
      },
    );
  }
}
