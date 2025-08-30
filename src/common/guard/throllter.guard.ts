import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class MethodBasedThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): Promise<string> {
    return req.ip; // vẫn tính theo IP
  }

  protected getLimit(context: ExecutionContext): number {
    const req = context.switchToHttp().getRequest();

    switch (req.method) {
      case 'POST':
      case 'PUT':
      case 'DELETE':
        return 5; // cho phép ít request hơn
      default:
        return 20; // GET thì thoáng hơn
    }
  }

  protected getTtl(context: ExecutionContext): number {
    return 60; // 60 giây
  }
}
