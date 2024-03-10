import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';
import { PrismaService } from '../prisma/prisma.service';
import { CheckIdMiddleware } from 'src/common/middleware/checkId.middleware';

@Module({
  controllers: [SettingController],
  providers: [SettingService],
})
export class SettingModule implements NestModule {
  constructor(private primsa: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(new CheckIdMiddleware(this.primsa, 'userPermission', 'userId').use).forRoutes({
      path: 'api/setting/user',
      method: RequestMethod.GET,
    });
  }
}
