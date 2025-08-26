import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { SubCategoryController } from './subcategory.controller';
import { SubCategoryService } from './subcategory.service';
import { PrismaService } from '../prisma/prisma.service';
import { SubCategoryHelper } from './subcategory.helper';
import applyMiddleware from 'src/common/middleware/applyFn.middleware';

@Module({
  controllers: [SubCategoryController],
  providers: [SubCategoryService, SubCategoryHelper],
})
export class SubCategoryModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    applyMiddleware(consumer, this.prisma, {
      type: 'subCategory',
      route: 'api/subcategory/detail',
      method: RequestMethod.GET,
    });
    applyMiddleware(consumer, this.prisma, {
      type: 'subCategory',
      route: 'api/subcategory/update',
      method: RequestMethod.PUT,
    });
  }
}
