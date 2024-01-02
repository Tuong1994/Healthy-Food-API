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

const getSelectFields = (langCode: ELang) => ({
  id: true,
  nameEn: langCode === ELang.EN,
  nameVn: langCode === ELang.VN,
  image: true,
  totalPrice: true,
});

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async getOrders(query: QueryDto) {
    const { page, limit, langCode, keywords, sortBy, orderStatus, paymentStatus, paymentMethod } = query;
    let collection: Paging<Order> = utils.defaultCollection();
    const orders = await this.prisma.order.findMany({
      where: {
        AND: [
          { paymentMethod: paymentMethod && Number(paymentMethod) },
          { paymentStatus: paymentStatus && Number(paymentStatus) },
          { status: orderStatus && Number(orderStatus) },
          { isDelete: { equals: false } },
        ],
      },
      orderBy: [{ updatedAt: helper.getSortBy(sortBy) ?? 'desc' }],
      include: { items: { select: { ...getSelectFields(langCode) } } },
    });
    if (keywords) {
      const filterOrders = orders.filter((order) =>
        order.orderNumber.toLowerCase().includes(keywords.toLowerCase()),
      );
      collection = utils.paging<Order>(filterOrders, page, limit);
    } else collection = utils.paging<Order>(orders, page, limit);
    return collection;
  }

  async getOrdersByCustomer(query: QueryDto) {
    const { page, limit, langCode, keywords, sortBy, orderStatus, paymentStatus, paymentMethod, customerId } =
      query;
    let collection: Paging<Order> = utils.defaultCollection();
    const orders = await this.prisma.order.findMany({
      where: {
        AND: [
          { customerId },
          { paymentMethod: paymentMethod && Number(paymentMethod) },
          { paymentStatus: paymentStatus && Number(paymentStatus) },
          { status: orderStatus && Number(orderStatus) },
          { isDelete: { equals: false } },
        ],
      },
      orderBy: [{ updatedAt: helper.getSortBy(sortBy) ?? 'desc' }],
      include: { items: { select: { ...getSelectFields(langCode) } } },
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
    const { orderId, langCode } = query;
    const order = await this.prisma.order.findUnique({
      where: { id: orderId, isDelete: { equals: false } },
      include: {
        items: {
          select: {
            quantity: true,
            product: {
              select: { ...getSelectFields(langCode) },
            },
          },
        },
      },
    });
    return order;
  }

  async createOrder(order: OrderDto) {
    const { status, paymentStatus, paymentMethod, customerId, items } = order;
    const newOrder = await this.prisma.order.create({
      data: {
        status,
        paymentStatus,
        paymentMethod,
        customerId,
        orderNumber: `#${Date.now()}`,
        isDelete: false,
      },
    });
    if (newOrder) {
      const orderItems: OrderItems = items.map((item) => ({
        ...item,
        isDelete: false,
        orderId: newOrder.id,
      }));
      await this.prisma.orderItem.createMany({ data: orderItems });
      const resOrder = await this.prisma.order.findUnique({
        where: { id: newOrder.id },
        include: {
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
      return resOrder;
    }
  }

  async updateOrder(query: QueryDto, order: OrderDto) {
    const { orderId } = query;
    const { status, paymentStatus, paymentMethod, customerId, orderNumber, items } = order;
    await this.prisma.order.update({
      where: { id: orderId },
      data: { status, paymentStatus, paymentMethod, customerId, orderNumber },
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
