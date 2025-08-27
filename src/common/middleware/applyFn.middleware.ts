import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { CheckIdMiddleware } from './checkId.middleware';
import { PrismaService } from 'src/modules/prisma/prisma.service';

type MiddlewareRoute = {
  path: string;
  method: RequestMethod;
};

type MiddlewareConfig = {
  consumer: MiddlewareConsumer;
  prisma: PrismaService;
  schema: string;
  routes: MiddlewareRoute[];
  fieldCheck?: string;
};

export const applyCheckIdMiddleware = (config: MiddlewareConfig) => {
  const { consumer, prisma, schema, routes, fieldCheck } = config;
  const mapRoutes = routes.map((route) => ({ path: route.path, method: route.method }));
  consumer.apply(new CheckIdMiddleware(prisma, schema, fieldCheck).use).forRoutes(...mapRoutes);
};
