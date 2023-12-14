import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { Order, OrderItem } from '@prisma/client';
import { OrderDto } from './order.dto';
import utils from 'src/utils';
import helper from 'src/helper';

type OrderItems = Array<Omit<OrderItem, 'createdAt' | 'updatedAt'>>;

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async getOrders(query: QueryDto) {
    const { page, limit, keywords, sortBy, orderStatus, paymentStatus, paymentType } = query;
    let collection: Paging<Order> = utils.defaultCollection();
    const orders = await this.prisma.order.findMany({
      where: {
        AND: [{ paymentType }, { paymentStatus }, { status: orderStatus }],
      },
      orderBy: [{ updatedAt: helper.getSortBy(sortBy) ?? 'desc' }],
      include: { orderItems: true },
    });
    if (keywords) {
      const filterOrders = orders.filter((order) =>
        order.orderNumber.toLowerCase().includes(keywords.toLowerCase()),
      );
      collection = utils.paging<Order>(filterOrders, page, limit);
    } else collection = utils.paging<Order>(orders, page, limit);
    return collection;
  }

  async getOrder(query: QueryDto) {
    const { orderId } = query;
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });
    return order;
  }

  async createOrder(order: OrderDto) {
    const { status, paymentStatus, paymentType, customerId, items } = order;
    const newOrder = await this.prisma.order.create({
      data: { status, paymentStatus, paymentType, customerId, orderNumber: `#${Date.now()}` },
    });
    if (newOrder) {
      const orderItems: OrderItems = items.map((item) => ({ ...item, orderId: newOrder.id }));
      await this.prisma.orderItem.createMany({ data: orderItems });
      const resOrder = await this.prisma.order.findUnique({
        where: { id: newOrder.id },
        include: { orderItems: { include: { product: true } } },
      });
      return resOrder;
    }
  }

  async updateOrder(query: QueryDto, order: OrderDto) {
    const { orderId } = query;
    const { status, paymentStatus, paymentType, customerId, orderNumber, items } = order;
    await this.prisma.order.update({
      where: { id: orderId },
      data: { status, paymentStatus, paymentType, customerId, orderNumber },
    });
    await this.prisma.orderItem.updateMany({ data: items });
    throw new HttpException('Updated success', HttpStatus.OK);
  }

  async removeOrders(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const orders = await this.prisma.order.findMany({ where: { id: { in: listIds } } });
    if (orders && orders.length > 0) {
      await this.prisma.order.deleteMany({ where: { id: { in: listIds } } });
      throw new HttpException('Removed success', HttpStatus.OK);
    }
    throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
  }
}
