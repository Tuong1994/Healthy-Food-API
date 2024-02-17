import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { ELang } from 'src/common/enum/base';
import { Order, OrderItem } from '@prisma/client';
import { OrderDto } from './order.dto';
import utils from 'src/utils';
import helper from 'src/helper';

type OrderItems = Array<Omit<OrderItem, 'createdAt' | 'updatedAt'>>;

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  private getSelectFields = (langCode: ELang) => {
    return {
      id: true,
      quantity: true,
      productId: true,
      product: {
        select: {
          id: true,
          nameEn: langCode === ELang.EN,
          nameVn: langCode === ELang.VN,
          image: true,
          totalPrice: true,
        },
      },
    };
  };

  async getOrders(query: QueryDto) {
    const {
      page,
      limit,
      langCode,
      keywords,
      sortBy,
      customerId,
      orderStatus,
      paymentStatus,
      paymentMethod,
      receivedType,
    } = query;
    let collection: Paging<Order> = utils.defaultCollection();
    const orders = await this.prisma.order.findMany({
      where: {
        AND: [
          { customerId },
          { paymentMethod: paymentMethod && Number(paymentMethod) },
          { paymentStatus: paymentStatus && Number(paymentStatus) },
          { receivedType: receivedType && Number(receivedType) },
          { status: orderStatus && Number(orderStatus) },
          { isDelete: { equals: false } },
        ],
      },
      orderBy: [{ updatedAt: helper.getSortBy(sortBy) ?? 'desc' }],
      include: {
        shipment: true,
        customer: { select: { id: true, fullName: true } },
        items: { select: { ...this.getSelectFields(langCode) } },
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
      const filterOrders = convertOrders.filter((order) =>
        order.orderNumber.toLowerCase().includes(keywords.toLowerCase()),
      );
      collection = utils.paging<Order>(filterOrders, page, limit);
    } else collection = utils.paging<Order>(convertOrders, page, limit);
    return collection;
  }

  async getOrdersByCustomer(query: QueryDto) {
    const {
      page,
      limit,
      langCode,
      keywords,
      sortBy,
      orderStatus,
      paymentStatus,
      paymentMethod,
      receivedType,
      customerId,
    } = query;
    let collection: Paging<Order> = utils.defaultCollection();
    const orders = await this.prisma.order.findMany({
      where: {
        AND: [
          { customerId },
          { paymentMethod: paymentMethod && Number(paymentMethod) },
          { paymentStatus: paymentStatus && Number(paymentStatus) },
          { receivedType: receivedType && Number(receivedType) },
          { status: orderStatus && Number(orderStatus) },
          { isDelete: { equals: false } },
        ],
      },
      orderBy: [{ updatedAt: helper.getSortBy(sortBy) ?? 'desc' }],
      include: { items: { select: { ...this.getSelectFields(langCode) } } },
    });
    const convertOrders = orders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({
        ...item,
        product: { ...utils.convertRecordsName(item.product, langCode) },
      })),
    }));
    if (keywords) {
      const filterOrders = convertOrders.filter((order) =>
        order.orderNumber.toLowerCase().includes(keywords.toLowerCase()),
      );
      collection = utils.paging<Order>(filterOrders, page, limit);
    } else collection = utils.paging<Order>(convertOrders, page, limit);
    return collection;
  }

  async getOrder(query: QueryDto) {
    const { orderId, langCode } = query;
    const order = await this.prisma.order.findUnique({
      where: { id: orderId, isDelete: { equals: false } },
      include: { shipment: true, items: { select: { ...this.getSelectFields(langCode) } } },
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
      customerId,
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
        customerId,
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
  }

  async updateOrder(query: QueryDto, order: OrderDto) {
    const { orderId } = query;
    const {
      status,
      paymentStatus,
      paymentMethod,
      receivedType,
      shipmentFee,
      totalPayment,
      customerId,
      orderNumber,
      note,
      items,
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
        customerId,
        orderNumber,
        note,
      },
    });
    await this.prisma.orderItem.updateMany({ data: items });
    throw new HttpException('Updated success', HttpStatus.OK);
  }

  async removeOrders(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const orders = await this.prisma.order.findMany({ where: { id: { in: listIds } } });
    if (orders && orders.length > 0) {
      await this.prisma.order.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
      throw new HttpException('Removed success', HttpStatus.OK);
    }
    throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
  }

  async removeOrdersPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const orders = await this.prisma.order.findMany({ where: { id: { in: listIds } } });
    if (orders && orders.length > 0) {
      await this.prisma.order.deleteMany({ where: { id: { in: listIds } } });
      throw new HttpException('Removed success', HttpStatus.OK);
    }
    throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
  }

  async restoreOrders() {
    await this.prisma.order.updateMany({ data: { isDelete: true } });
    throw new HttpException('Restored success', HttpStatus.OK);
  }
}
