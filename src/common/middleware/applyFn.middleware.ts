import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { CheckIdMiddleware } from './checkId.middleware';
import { PrismaService } from 'src/modules/prisma/prisma.service';

type MiddlewareConfig = {
  type: string;
  route: string;
  method: RequestMethod;
};

export const applyCheckIdMiddleware = (consumer: MiddlewareConsumer, prisma: PrismaService, config: MiddlewareConfig) => {
  const { type, route, method } = config;
  consumer.apply(new CheckIdMiddleware(prisma, type).use).forRoutes({
    path: route,
    method,
  });
};
