import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { ELang } from 'src/common/enum/base';
import { Order } from '@prisma/client';
import { OrderDto } from './order.dto';
import { OrderHelper } from './order.helper';
import { OrderItems } from './order.type';
import responseMessage from 'src/common/message';
import utils from 'src/utils';

const { CREATE_ERROR, UPDATE_SUCCESS, REMOVE_SUCCESS, RESTORE_SUCCESS, NOT_FOUND, NO_DATA_RESTORE } = responseMessage;

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private orderHelper: OrderHelper,
  ) {}

  private queryFilter = (
    userId: string,
    paymentMethod: number,
    paymentStatus: number,
    receivedType: number,
    orderStatus: number,
  ) => [
    { userId },
    { paymentMethod: paymentMethod && Number(paymentMethod) },
    { paymentStatus: paymentStatus && Number(paymentStatus) },
    { receivedType: receivedType && Number(receivedType) },
    { status: orderStatus && Number(orderStatus) },
    { isDelete: { equals: false } },
  ];

  async getOrders(query: QueryDto) {
    const { page, limit, langCode, keywords, sortBy, userId, orderStatus, paymentStatus, paymentMethod, receivedType } =
      query;
    let collection: Paging<Order> = utils.defaultCollection();
    const orders = await this.prisma.order.findMany({
      where: { AND: this.queryFilter(userId, paymentMethod, paymentStatus, receivedType, orderStatus) },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      include: {
        user: { select: { id: true, fullName: true } },
        creator: { select: { id: true, fullName: true } },
        items: { select: { ...this.orderHelper.getSelectItemFields(langCode) } },
      },
    });
    const convertOrders = orders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({
        ...item,
        product: { ...utils.convertRecordsName(item.product, langCode) },
      })),
    }));
    if (keywords) {
      const filterOrders = convertOrders.filter((order) => utils.filterByKeywords(order.orderNumber, keywords));
      collection = utils.paging<Order>(filterOrders, page, limit);
    } else collection = utils.paging<Order>(convertOrders, page, limit);
    return collection;
  }

  async getOrdersByUser(query: QueryDto) {
    const { page, limit, langCode, keywords, sortBy, orderStatus, paymentStatus, paymentMethod, receivedType, userId } =
      query;
    let collection: Paging<Order> = utils.defaultCollection();
    const orders = await this.prisma.order.findMany({
      where: { AND: this.queryFilter(userId, paymentMethod, paymentStatus, receivedType, orderStatus) },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      include: { items: { select: { ...this.orderHelper.getSelectItemFields(langCode) } } },
    });
    const convertOrders = orders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({
        ...item,
        product: { ...utils.convertRecordsName(item.product, langCode) },
      })),
    }));
    if (keywords) {
      const filterOrders = convertOrders.filter((order) => utils.filterByKeywords(order.orderNumber, keywords));
      collection = utils.paging<Order>(filterOrders, page, limit);
    } else collection = utils.paging<Order>(convertOrders, page, limit);
    return collection;
  }

  async getOrder(query: QueryDto) {
    const { orderId, langCode } = query;
    const order = await this.prisma.order.findUnique({
      where: { id: orderId, isDelete: { equals: false } },
      include: {
        shipment: { where: { isDelete: { equals: false } } },
        items: { select: { ...this.orderHelper.getSelectItemFields(langCode) } },
      },
    });
    return {
      ...order,
      items: order.items.map((item) => ({
        ...item,
        product: { ...utils.convertRecordsName(item.product, langCode) },
      })),
    };
  }

  async createOrder(order: OrderDto) {
    const {
      status,
      paymentStatus,
      paymentMethod,
      receivedType,
      shipmentFee,
      totalPayment,
      userId,
      creatorId,
      note,
      items,
      shipment,
    } = order;
    const newOrder = await this.prisma.order.create({
      data: {
        status,
        paymentStatus,
        paymentMethod,
        receivedType,
        shipmentFee,
        totalPayment,
        userId,
        creatorId,
        note,
        isDelete: false,
        orderNumber: `#O_${Date.now()}`,
      },
    });
    if (newOrder) {
      const orderItems: OrderItems = items.map((item) => ({
        ...item,
        isDelete: false,
        orderId: newOrder.id,
      }));
      await this.prisma.orderItem.createMany({ data: orderItems });
      if (shipment) {
        await this.prisma.shipment.create({
          data: { ...shipment, orderId: newOrder.id, shipmentNumber: `#S_${Date.now()}`, isDelete: false },
        });
      }
      const responseOrder = await this.prisma.order.findUnique({
        where: { id: newOrder.id },
        include: {
          shipment: true,
          items: {
            select: {
              quantity: true,
              product: {
                select: { id: true, nameEn: true, nameVn: true, image: true, totalPrice: true },
              },
            },
          },
        },
      });
      return {
        ...responseOrder,
        items: responseOrder.items.map((item) => ({
          ...item,
          product: { ...utils.convertRecordsName(item.product, ELang.EN) },
        })),
      };
    }
    throw new HttpException(CREATE_ERROR, HttpStatus.BAD_REQUEST);
  }

  async updateOrder(query: QueryDto, order: OrderDto) {
    const { orderId, ids } = query;
    const {
      status,
      paymentStatus,
      paymentMethod,
      receivedType,
      shipmentFee,
      totalPayment,
      userId,
      orderNumber,
      note,
      items,
      shipment,
    } = order;
    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        paymentStatus,
        paymentMethod,
        receivedType,
        shipmentFee,
        totalPayment,
        userId,
        orderNumber,
        note,
      },
    });
    if (ids && ids.length > 0) {
      const listIds = ids.split(',');
      await this.prisma.orderItem.deleteMany({ where: { productId: { in: listIds } } });
    }
    await Promise.all(
      items.map(async (item) => {
        if (item.id) await this.prisma.orderItem.update({ where: { id: item.id }, data: { ...item } });
        else await this.prisma.orderItem.create({ data: { ...item, orderId, isDelete: false } });
      }),
    );
    if (shipment) {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        select: { shipment: true },
      });
      if (order.shipment) await this.prisma.shipment.update({ where: { id: order.shipment.id }, data: shipment });
      else
        await this.prisma.shipment.create({
          data: { ...shipment, orderId, shipmentNumber: `#S_${Date.now()}`, isDelete: false },
        });
    }
    throw new HttpException(UPDATE_SUCCESS, HttpStatus.OK);
  }

  async removeOrders(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const orders = await this.prisma.order.findMany({
      where: { id: { in: listIds } },
      select: { id: true, items: true, shipment: true },
    });
    if (orders && !orders.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await Promise.all(
      orders.map(async (order) => {
        await this.orderHelper.handleUpdateIsDeleteOrder(order, true);
        await this.orderHelper.handleUpdateIsDeleteOrderShipment(order, true);
        await this.orderHelper.handleUpdateIsDeleteOrderItems(order, true);
      }),
    );
    throw new HttpException(REMOVE_SUCCESS, HttpStatus.OK);
  }

  async removeOrdersPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const orders = await this.prisma.order.findMany({ where: { id: { in: listIds } } });
    if (orders && !orders.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.order.deleteMany({ where: { id: { in: listIds } } });
    throw new HttpException(REMOVE_SUCCESS, HttpStatus.OK);
  }

  async restoreOrders() {
    const orders = await this.prisma.order.findMany({
      where: { isDelete: { equals: true } },
      select: { id: true, items: true, shipment: true },
    });
    if (orders && !orders.length) throw new HttpException(NO_DATA_RESTORE, HttpStatus.OK);
    await Promise.all(
      orders.map(async (order) => {
        await this.orderHelper.handleUpdateIsDeleteOrder(order, false);
        await this.orderHelper.handleUpdateIsDeleteOrderShipment(order, false);
        await this.orderHelper.handleUpdateIsDeleteOrderItems(order, false);
      }),
    );
    throw new HttpException(RESTORE_SUCCESS, HttpStatus.OK);
  }
}
