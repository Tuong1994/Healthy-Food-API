import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStategy } from 'src/common/strategy/jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthHelper } from './auth.helper';
import { EmailHelper } from '../email/email.helper';
import { applyCheckIdMiddleware } from 'src/common/middleware/applyFn.middleware';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from 'src/common/strategy/google.strategy';
import { UserHelper } from '../user/user.helper';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'google' }), JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AuthHelper, EmailHelper, UserHelper, JwtService, JwtStategy, GoogleStrategy],
})
export class AuthModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    applyCheckIdMiddleware({
      consumer,
      prisma: this.prisma,
      schema: 'user',
      routes: [
        {
          path: 'api/auth/logout',
          method: RequestMethod.POST,
        },
      ],
    });
  }
}
