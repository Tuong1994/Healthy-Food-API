import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ERole } from '../enum/base';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requireRoles = this.reflector.getAllAndOverride<ERole[]>('role', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requireRoles) return true;
    const { user, query } = context.switchToHttp().getRequest();
    const isMatch = requireRoles.some((role) => user?.role === role);
    if (Boolean(query.admin)) {
      if (isMatch) return true;
      throw new ForbiddenException("You're not authorize to process");
    } else return true;
  }
}
