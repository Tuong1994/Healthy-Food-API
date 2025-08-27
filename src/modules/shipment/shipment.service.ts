import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { Shipment } from '@prisma/client';
import { ShipmentDto } from './shipment.dto';
import { EReceivedType } from '../order/order.enum';
import responseMessage from 'src/common/message';
import utils from 'src/utils';

const { UPDATE_SUCCESS, REMOVE_SUCCESS, RESTORE_SUCCESS, NOT_FOUND, NO_DATA_RESTORE } = responseMessage;
@Injectable()
export class ShipmentService {
  constructor(private prisma: PrismaService) {}

  async getShipments(query: QueryDto) {
    const { page, limit, keywords, sortBy } = query;
    let collection: Paging<Shipment> = utils.defaultCollection();
    const shipments = await this.prisma.shipment.findMany({
      where: { isDelete: { equals: false } },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      include: { order: { select: { id: true, orderNumber: true } } },
    });
    if (keywords) {
      const filterShipments = shipments.filter(
        (shipment) =>
          utils.filterByKeywords(shipment.fullName, keywords) ||
          utils.filterByKeywords(shipment.phone, keywords) ||
          utils.filterByKeywords(shipment.email, keywords),
      );
      collection = utils.paging<Shipment>(filterShipments, page, limit);
    } else collection = utils.paging<Shipment>(shipments, page, limit);
    return collection;
  }

  async getShipment(query: QueryDto) {
    const { shipmentId } = query;
    const shipment = await this.prisma.shipment.findUnique({
      where: { id: shipmentId, isDelete: { equals: false } },
      include: { order: { select: { id: true, orderNumber: true } } },
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
    throw new HttpException(UPDATE_SUCCESS, HttpStatus.OK);
  }

  async removeShipments(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const shipments = await this.prisma.shipment.findMany({ where: { id: { in: listIds } } });
    if (shipments && !shipments.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.shipment.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    throw new HttpException(REMOVE_SUCCESS, HttpStatus.OK);
  }

  async removeShipmentsPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const shipments = await this.prisma.shipment.findMany({ where: { id: { in: listIds } } });
    if (shipments && !shipments.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await Promise.all(
      shipments.map(async (shipment) => {
        await this.prisma.order.update({
          where: { id: shipment.orderId },
          data: { receivedType: EReceivedType.STORE },
        });
      }),
    );
    await this.prisma.shipment.deleteMany({ where: { id: { in: listIds } } });
    throw new HttpException(REMOVE_SUCCESS, HttpStatus.OK);
  }

  async restoreShipments() {
    const shipments = await this.prisma.shipment.findMany({ where: { isDelete: { equals: true } } });
    if (shipments && !shipments.length) throw new HttpException(NO_DATA_RESTORE, HttpStatus.OK);
    await Promise.all(
      shipments.map(async (shipment) => {
        await this.prisma.shipment.update({ where: { id: shipment.id }, data: { isDelete: false } });
      }),
    );
    throw new HttpException(RESTORE_SUCCESS, HttpStatus.OK);
  }
}
