import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SettingPermissionDto } from './setting.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class SettingService {
  constructor(private prisma: PrismaService) {}

  async getUserPermission(query: QueryDto) {
    const { userId } = query;
    const userPermission = await this.prisma.userPermission.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            email: true,
            gender: true,
            birthday: true,
            role: true,
          },
        },
      },
    });
    return userPermission;
  }

  async settingPermission(permission: SettingPermissionDto) {
    const { create, update, remove, userId } = permission;
    await this.prisma.userPermission.update({ where: { userId }, data: { create, update, remove } });
    throw new HttpException('Setting success', HttpStatus.OK);
  }
}
