import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserHelper } from './user.helper';
import { PrismaService } from '../prisma/prisma.service';
import { applyCheckIdMiddleware } from 'src/common/middleware/applyFn.middleware';

@Module({
  controllers: [UserController],
  providers: [UserService, UserHelper],
})
export class UserModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    applyCheckIdMiddleware({
      consumer,
      prisma: this.prisma,
      schema: 'user',
      routes: [
        {
          path: 'api/user/detail',
          method: RequestMethod.GET,
        },
        {
          path: 'api/user/update',
          method: RequestMethod.PUT,
        },
      ],
    });
  }
}
