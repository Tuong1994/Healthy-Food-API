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
import { ERole } from 'src/common/enum/base';
import { RoleGuard } from 'src/common/guard/role.guard';

@Controller('api/order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  getOrders(@QueryPaging() query: QueryDto) {
    return this.orderService.getOrders(query);
  }

  @Get('listByCustomer')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getOrdersByCustomer(@QueryPaging() query: QueryDto) {
    return this.orderService.getOrdersByCustomer(query);
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
  @Roles(ERole.ADMIN, ERole.SUPER_ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  updateOrder(@Query() query: QueryDto, @Body() order: OrderDto) {
    return this.orderService.updateOrder(query, order);
  }

  @Delete('remove')
  @Roles(ERole.ADMIN, ERole.SUPER_ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeOrders(@Query() query: QueryDto) {
    return this.orderService.removeOrders(query);
  }

  @Delete('removePermanent')
  @Roles(ERole.SUPER_ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeOrdersPermanent(@Query() query: QueryDto) {
    return this.orderService.removeOrdersPermanent(query);
  }

  @Post('restore')
  @Roles(ERole.SUPER_ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  restoreOrders() {
    return this.orderService.restoreOrders();
  }
}
