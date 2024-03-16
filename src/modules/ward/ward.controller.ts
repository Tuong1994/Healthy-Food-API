import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WardService } from './ward.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { QueryPaging } from 'src/common/decorator/query.decorator';
import { Roles } from 'src/common/decorator/role.decorator';
import { EPermission, ERole } from 'src/common/enum/base';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { WardDto } from './ward.dto';
import { Permission } from 'src/common/decorator/permission.decorator';
import { PermissionGuard } from 'src/common/guard/permission.guard';

@Controller('api/ward')
export class WardController {
  constructor(private wardService: WardService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  getWards(@Query() query: QueryDto) {
    return this.wardService.getWards(query);
  }

  @Get('listPaging')
  @HttpCode(HttpStatus.OK)
  getWardsPaging(@QueryPaging() query: QueryDto) {
    return this.wardService.getWardsPaging(query);
  }

  @Get('detail')
  @HttpCode(HttpStatus.OK)
  getWard(@Query() query: QueryDto) {
    return this.wardService.getWard(query);
  }

  @Post('create')
  @Roles(ERole.STAFF, ERole.LEADER, ERole.MANAGER)
  @Permission(EPermission.CREATE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @HttpCode(HttpStatus.CREATED)
  createWard(@Body() ward: WardDto) {
    return this.wardService.createWard(ward);
  }

  @Put('update')
  @Roles(ERole.STAFF, ERole.LEADER, ERole.MANAGER)
  @Permission(EPermission.UPDATE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  updateWard(@Query() query: QueryDto, @Body() ward: WardDto) {
    return this.wardService.updateWard(query, ward);
  }

  @Delete('remove')
  @Roles(ERole.STAFF, ERole.LEADER, ERole.MANAGER)
  @Permission(EPermission.REMOVE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  removeWards(@Query() query: QueryDto) {
    return this.wardService.removeWards(query);
  }

  @Delete('removePermenant')
  @Roles(ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeWardsPermanent(@Query() query: QueryDto) {
    return this.wardService.removeWardsPermanent(query);
  }

  @Post('restore')
  @Roles(ERole.LEADER, ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  restoreWards() {
    return this.wardService.restoreWards();
  }
}
