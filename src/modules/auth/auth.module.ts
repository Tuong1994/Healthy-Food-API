import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStategy } from 'src/common/strategy/jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { CheckIdMiddleware } from 'src/common/middleware/checkId.middleware';
import { AuthHelper } from './auth.helper';
import { EmailHelper } from '../email/email.helper';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AuthHelper, EmailHelper, JwtService, JwtStategy],
})
export class AuthModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(new CheckIdMiddleware(this.prisma, 'user').use).forRoutes(
      {
        path: 'api/auth/refresh',
        method: RequestMethod.POST,
      },
      {
        path: 'api/auth/logout',
        method: RequestMethod.POST,
      },
    );
  }
}
