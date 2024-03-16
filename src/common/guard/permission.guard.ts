import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { EPermission } from '../enum/base';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const permission = this.reflector.getAllAndOverride<EPermission>('permission', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!permission) return true;
    const { user } = context.switchToHttp().getRequest();
    const exceptionMessage = "You're not authorize to proccess";
    switch (permission) {
      case EPermission.CREATE: {
        if (user.permission?.create) return true;
        throw new ForbiddenException(exceptionMessage);
      }
      case EPermission.UPDATE: {
        if (user.permission?.update) return true;
        throw new ForbiddenException(exceptionMessage);
      }
      case EPermission.REMOVE: {
        if (user.permission?.remove) return true;
        throw new ForbiddenException(exceptionMessage);
      }
    }
  }
}
