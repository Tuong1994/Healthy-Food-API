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
import { DistrictService } from './district.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { QueryPaging } from 'src/common/decorator/query.decorator';
import { Roles } from 'src/common/decorator/role.decorator';
import { EPermission, ERole } from 'src/common/enum/base';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { DistrictDto } from './district.dto';
import { Permission } from 'src/common/decorator/permission.decorator';
import { PermissionGuard } from 'src/common/guard/permission.guard';

@Controller('api/district')
export class DistrictController {
  constructor(private districtService: DistrictService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  getDistricts(@Query() query: QueryDto) {
    return this.districtService.getDistricts(query);
  }

  @Get('listPaging')
  @HttpCode(HttpStatus.OK)
  getDistrictsPaging(@QueryPaging() query: QueryDto) {
    return this.districtService.getDistrictsPaging(query);
  }

  @Get('detail')
  @HttpCode(HttpStatus.OK)
  getDistrict(@Query() query: QueryDto) {
    return this.districtService.getDistrict(query);
  }

  @Post('create')
  @Roles(ERole.STAFF, ERole.LEADER, ERole.MANAGER)
  @Permission(EPermission.CREATE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @HttpCode(HttpStatus.CREATED)
  createDistrict(@Body() district: DistrictDto) {
    return this.districtService.createDistrict(district);
  }

  @Put('update')
  @Roles(ERole.STAFF, ERole.LEADER, ERole.MANAGER)
  @Permission(EPermission.UPDATE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  updateDistrict(@Query() query: QueryDto, @Body() district: DistrictDto) {
    return this.districtService.updateDistrict(query, district);
  }

  @Delete('remove')
  @Roles(ERole.STAFF, ERole.LEADER, ERole.MANAGER)
  @Permission(EPermission.REMOVE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  removeDistricts(@Query() query: QueryDto) {
    return this.districtService.removeDistricts(query);
  }

  @Delete('removePermanent')
  @Roles(ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeDistrictsPermanent(@Query() query: QueryDto) {
    return this.districtService.removeDistrictsPermanent(query);
  }

  @Post('restore')
  @Roles(ERole.LEADER, ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  restoreDistricts() {
    return this.districtService.restoreDistricts();
  }
}
