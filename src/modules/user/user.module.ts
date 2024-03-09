import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserHelper } from './user.helper';
import { CheckIdMiddleware } from 'src/common/middleware/checkId.middleware';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserHelper],
})
export class UserModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(new CheckIdMiddleware(this.prisma, 'user').use).forRoutes(
      {
        path: 'api/user/detail',
        method: RequestMethod.GET,
      },
      {
        path: 'api/user/update',
        method: RequestMethod.PUT,
      },
    );
  }
}
