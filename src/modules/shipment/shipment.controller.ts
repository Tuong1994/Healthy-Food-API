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
import { ShipmentService } from './shipment.service';
import { QueryPaging } from 'src/common/decorator/query.decorator';
import { QueryDto } from 'src/common/dto/query.dto';
import { Roles } from 'src/common/decorator/role.decorator';
import { EPermission, ERole } from 'src/common/enum/base';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { ShipmentDto } from './shipment.dto';
import { Permission } from 'src/common/decorator/permission.decorator';
import { PermissionGuard } from 'src/common/guard/permission.guard';

@Controller('api/shipment')
export class ShipmentController {
  constructor(private shipmentService: ShipmentService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  getShipments(@QueryPaging() query: QueryDto) {
    return this.shipmentService.getShipments(query);
  }

  @Get('detail')
  @HttpCode(HttpStatus.OK)
  getShipment(@Query() query: QueryDto) {
    return this.shipmentService.getShipment(query);
  }

  @Post('create')
  @Roles(ERole.STAFF, ERole.LEADER, ERole.MANAGER)
  @Permission(EPermission.CREATE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @HttpCode(HttpStatus.CREATED)
  createShipment(@Body() shipment: ShipmentDto) {
    return this.shipmentService.createShipment(shipment);
  }

  @Put('update')
  @Roles(ERole.STAFF, ERole.LEADER, ERole.MANAGER)
  @Permission(EPermission.UPDATE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  updateShipment(@Query() query: QueryDto, @Body() shipment: ShipmentDto) {
    return this.shipmentService.updateShipment(query, shipment);
  }

  @Delete('remove')
  @Roles(ERole.STAFF, ERole.LEADER, ERole.MANAGER)
  @Permission(EPermission.REMOVE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  removeShipments(@Query() query: QueryDto) {
    return this.shipmentService.removeShipments(query);
  }

  @Delete('removePermanent')
  @Roles(ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeShipmentsPermanent(@Query() query: QueryDto) {
    return this.shipmentService.removeShipmentsPermanent(query);
  }

  @Post('restore')
  @Roles(ERole.STAFF, ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  restoreShipments() {
    return this.shipmentService.restoreShipments();
  }
}
