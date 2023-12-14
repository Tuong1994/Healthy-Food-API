import { ExecutionContext, HttpException, HttpStatus, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const QueryPaging = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const { query } = ctx.switchToHttp().getRequest<Request>();
  if (Object.keys(query).length === 0) throw new HttpException('Query is missing', HttpStatus.BAD_REQUEST);
  const { page, limit } = query;
  if (!page || !limit) throw new HttpException('page and limit are required', HttpStatus.BAD_REQUEST);
  return query;
});
