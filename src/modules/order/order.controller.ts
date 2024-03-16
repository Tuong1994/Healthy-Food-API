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
import { OrderService } from './order.service';
import { QueryPaging } from 'src/common/decorator/query.decorator';
import { QueryDto } from 'src/common/dto/query.dto';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { OrderDto } from './order.dto';
import { Roles } from 'src/common/decorator/role.decorator';
import { EPermission, ERole } from 'src/common/enum/base';
import { RoleGuard } from 'src/common/guard/role.guard';
import { Permission } from 'src/common/decorator/permission.decorator';
import { PermissionGuard } from 'src/common/guard/permission.guard';

@Controller('api/order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  getOrders(@QueryPaging() query: QueryDto) {
    return this.orderService.getOrders(query);
  }

  @Get('listByUser')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getOrdersByUser(@QueryPaging() query: QueryDto) {
    return this.orderService.getOrdersByUser(query);
  }

  @Get('detail')
  @HttpCode(HttpStatus.OK)
  getOrder(@Query() query: QueryDto) {
    return this.orderService.getOrder(query);
  }

  @Post('create')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  createOrder(@Body() order: OrderDto) {
    return this.orderService.createOrder(order);
  }

  @Put('update')
  @Roles(ERole.STAFF, ERole.LEADER, ERole.MANAGER)
  @Permission(EPermission.UPDATE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  updateOrder(@Query() query: QueryDto, @Body() order: OrderDto) {
    return this.orderService.updateOrder(query, order);
  }

  @Delete('remove')
  @Roles(ERole.STAFF, ERole.LEADER, ERole.MANAGER)
  @Permission(EPermission.REMOVE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  removeOrders(@Query() query: QueryDto) {
    return this.orderService.removeOrders(query);
  }

  @Delete('removePermanent')
  @Roles(ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeOrdersPermanent(@Query() query: QueryDto) {
    return this.orderService.removeOrdersPermanent(query);
  }

  @Post('restore')
  @Roles(ERole.LEADER, ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  restoreOrders() {
    return this.orderService.restoreOrders();
  }
}
