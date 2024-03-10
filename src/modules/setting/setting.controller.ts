import { Body, Put, Controller, HttpCode, HttpStatus, UseGuards, Get, Query } from '@nestjs/common';
import { SettingService } from './setting.service';
import { Roles } from 'src/common/decorator/role.decorator';
import { ERole } from 'src/common/enum/base';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { SettingPermissionDto } from './setting.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('api/setting')
export class SettingController {
  constructor(private settingService: SettingService) {}

  @Get('user')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getUserPermission(@Query() query: QueryDto) {
    return this.settingService.getUserPermission(query);
  }

  @Put('permission')
  @Roles(ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  settingPermission(@Body() permission: SettingPermissionDto) {
    return this.settingService.settingPermission(permission);
  }
}
