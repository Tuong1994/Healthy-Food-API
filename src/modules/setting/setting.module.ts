import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';
import { PrismaService } from '../prisma/prisma.service';
import { applyCheckIdMiddleware } from 'src/common/middleware/applyFn.middleware';

@Module({
  controllers: [SettingController],
  providers: [SettingService],
})
export class SettingModule implements NestModule {
  constructor(private primsa: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    applyCheckIdMiddleware({
      consumer,
      prisma: this.primsa,
      schema: 'usePermission',
      fieldCheck: 'userId',
      routes: [
        {
          path: 'api/setting/user',
          method: RequestMethod.GET,
        },
      ],
    });
  }
}
