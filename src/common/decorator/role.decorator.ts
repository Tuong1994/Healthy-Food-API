import { SetMetadata } from '@nestjs/common';
import { ERole } from '../enum/base';

export const Roles = (...roles: ERole[]) => SetMetadata('roles', roles);
