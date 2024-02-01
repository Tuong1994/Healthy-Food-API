import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { Shipment } from '@prisma/client';
import { ShipmentDto } from './shipment.dto';
import utils from 'src/utils';
import helper from 'src/helper';

@Injectable()
export class ShipmentService {
  constructor(private prisma: PrismaService) {}

  async getShipments(query: QueryDto) {
    const { page, limit, keywords, sortBy } = query;
    let collection: Paging<Shipment> = utils.defaultCollection();
    const shipments = await this.prisma.shipment.findMany({
      where: { isDelete: { equals: false } },
      orderBy: [{ updatedAt: helper.getSortBy(sortBy) ?? 'desc' }],
      include: { order: { select: { id: true, orderNumber: true } } },
    });
    if (keywords) {
      const filterShipments = shipments.filter(
        (shipment) =>
          shipment.fullName.toLowerCase().includes(keywords.toLowerCase()) ||
          shipment.phone.toLowerCase().includes(keywords.toLowerCase()) ||
          shipment.email.toLowerCase().includes(keywords.toLowerCase()),
      );
      collection = utils.paging<Shipment>(filterShipments, page, limit);
    } else collection = utils.paging<Shipment>(shipments, page, limit);
    return collection;
  }

  async getShipment(query: QueryDto) {
    const { shipmentId } = query;
    const shipment = await this.prisma.shipment.findUnique({
      where: { id: shipmentId, isDelete: { equals: false } },
    });
    return shipment;
  }

  async createShipment(shipment: ShipmentDto) {
    const { fullName, phone, email, address, orderId } = shipment;
    const newShipment = await this.prisma.shipment.create({
      data: { shipmentNumber: `#S_${Date.now()}`, fullName, phone, email, address, orderId, isDelete: false },
    });
    return newShipment;
  }

  async updateShipment(query: QueryDto, shipment: ShipmentDto) {
    const { shipmentId } = query;
    const { fullName, phone, email, address, orderId, shipmentNumber } = shipment;
    await this.prisma.shipment.update({
      where: { id: shipmentId },
      data: { fullName, phone, email, address, orderId, shipmentNumber },
    });
    throw new HttpException('Updated success', HttpStatus.OK);
  }

  async removeShipments(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const shipments = await this.prisma.shipment.findMany({ where: { id: { in: listIds } } });
    if (shipments && shipments.length > 0) {
      await this.prisma.shipment.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
      throw new HttpException('Removed success', HttpStatus.OK);
    }
    throw new HttpException('Shipment not found', HttpStatus.NOT_FOUND);
  }

  async removeShipmentsPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const shipments = await this.prisma.shipment.findMany({ where: { id: { in: listIds } } });
    if (shipments && shipments.length > 0) {
      await this.prisma.shipment.deleteMany({ where: { id: { in: listIds } } });
      throw new HttpException('Removed success', HttpStatus.OK);
    }
    throw new HttpException('Shipment not found', HttpStatus.NOT_FOUND);
  }

  async restoreShipments() {
    await this.prisma.shipment.updateMany({ data: { isDelete: false } });
    throw new HttpException('Restored success', HttpStatus.OK);
  }
}
