import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { QueryPaging } from 'src/common/decorator/query.decorator';
import { RoleGuard } from 'src/common/guard/role.guard';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { EPermission, ERole } from 'src/common/enum/base';
import { UserDto } from 'src/modules/user/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOption } from 'src/common/config/multer.config';
import { PermissionGuard } from 'src/common/guard/permission.guard';
import { Permission } from 'src/common/decorator/permission.decorator';

@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  getUsers(@QueryPaging() query: QueryDto) {
    return this.userService.getUsers(query);
  }

  @Get('detail')
  @HttpCode(HttpStatus.OK)
  getUser(@Query() query: QueryDto) {
    return this.userService.getUser(query);
  }

  @Post('create')
  @Roles(ERole.STAFF, ERole.LEADER, ERole.MANAGER)
  @Permission(EPermission.CREATE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @UseInterceptors(FileInterceptor('image', multerOption()))
  @HttpCode(HttpStatus.CREATED)
  createUser(@Query() query: QueryDto, @UploadedFile() file: Express.Multer.File, @Body() user: UserDto) {
    return this.userService.createUser(query, file, user);
  }

  @Put('update')
  @Roles(ERole.STAFF, ERole.LEADER, ERole.MANAGER)
  @Permission(EPermission.UPDATE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @UseInterceptors(FileInterceptor('image', multerOption()))
  @HttpCode(HttpStatus.OK)
  updateUser(@Query() query: QueryDto, @UploadedFile() file: Express.Multer.File, @Body() user: UserDto) {
    return this.userService.updateUser(query, file, user);
  }

  @Delete('remove')
  @Roles(ERole.STAFF, ERole.LEADER, ERole.MANAGER)
  @Permission(EPermission.REMOVE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  removeUsers(@Query() query: QueryDto) {
    return this.userService.removeUsers(query);
  }

  @Delete('removeAddress')
  @Roles(ERole.STAFF, ERole.LEADER, ERole.MANAGER)
  @Permission(EPermission.REMOVE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  removeAddress(@Query() query: QueryDto) {
    return this.userService.removeAddress(query);
  }

  @Delete('removePermanent')
  @Roles(ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeUsersPermanent(@Query() query: QueryDto) {
    return this.userService.removeUsersPermanent(query);
  }

  @Post('restore')
  @Roles(ERole.LEADER, ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  restoreUsers() {
    return this.userService.restoreUsers();
  }
}
