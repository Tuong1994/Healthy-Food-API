import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CheckIdMiddleware } from 'src/common/middleware/checkId.middleware';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(new CheckIdMiddleware(this.prisma, 'customer').use).forRoutes(
      {
        path: 'api/customer/detail',
        method: RequestMethod.GET,
      },
      {
        path: 'api/customer/update',
        method: RequestMethod.PUT,
      },
    );
  }
}
