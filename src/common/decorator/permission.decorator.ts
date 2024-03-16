import { SetMetadata } from '@nestjs/common';
import { EPermission } from '../enum/base';

export const Permission = (permission: EPermission) => SetMetadata('permission', permission);
