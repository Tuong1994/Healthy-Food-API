import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import helper from 'src/helper';

@Injectable()
export class StatisticService {
  constructor(private prisma: PrismaService) {}

  async getGeneral() {
    const currentYear = new Date().getFullYear();
    const dateRange = {
      gte: new Date(currentYear, 0, 1), // January 1st of current year
      lt: new Date(currentYear + 1, 0, 1), // January 1st of next year
    };

    const customers = await this.prisma.customer.findMany({
      where: { isDelete: { equals: false }, createdAt: dateRange },
    });
    const products = await this.prisma.product.findMany({
      where: { isDelete: { equals: false }, createdAt: dateRange },
    });
    const orders = await this.prisma.order.findMany({
      where: { isDelete: { equals: false }, createdAt: dateRange },
    });
    const totalCustomers = customers.length;
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalRevenue = helper.getTotalPayment(orders);
    return { totalCustomers, totalProducts, totalOrders, totalRevenue };
  }

  async getRecentOrders() {
    const currentDate = new Date();

    const currentWeekFirstDate = new Date(currentDate);
    currentWeekFirstDate.setDate(currentDate.getDate() - currentDate.getDay());

    const currentWeekLastDate = new Date(currentDate);
    currentWeekLastDate.setDate(currentDate.getDate() + (6 - currentDate.getDay()));

    const orders = await this.prisma.order.findMany({
      where: {
        isDelete: { equals: false },
        createdAt: {
          gte: currentWeekFirstDate,
          lte: currentWeekLastDate,
        },
      },
    });

    return { totalItems: orders.length, items: orders };
  }

  async getChartRevenue() {
    let data = [];
    const currentDate = new Date();
    const previousDate = new Date(currentDate);
    previousDate.setDate(currentDate.getDate() - 1);
    const precedingDate = new Date(currentDate);
    precedingDate.setDate(currentDate.getDate() - 2);
    const ordersCurrentDate = await this.prisma.order.findMany({
      where: {
        isDelete: { equals: false },
        createdAt: {
          gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
          lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1),
        },
      },
    });
    const ordersPreviousDate = await this.prisma.order.findMany({
      where: {
        isDelete: { equals: false },
        createdAt: {
          gte: new Date(previousDate.getFullYear(), previousDate.getMonth(), previousDate.getDate()),
          lt: new Date(previousDate.getFullYear(), previousDate.getMonth(), previousDate.getDate() + 1),
        },
      },
    });
    const ordersPrecedingDate = await this.prisma.order.findMany({
      where: {
        isDelete: { equals: false },
        createdAt: {
          gte: new Date(precedingDate.getFullYear(), precedingDate.getMonth(), precedingDate.getDate()),
          lt: new Date(precedingDate.getFullYear(), precedingDate.getMonth(), precedingDate.getDate() + 1),
        },
      },
    });
    const currentDateData = { date: currentDate, total: helper.getTotalPayment(ordersCurrentDate) };
    const previousDateData = { date: previousDate, total: helper.getTotalPayment(ordersPreviousDate) };
    const precedingDateData = { date: precedingDate, total: helper.getTotalPayment(ordersPrecedingDate) };
    data = [...data, precedingDateData, previousDateData, currentDateData];
    return data;
  }
}
