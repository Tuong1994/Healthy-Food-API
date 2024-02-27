import { Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';

@Injectable()
export class StatisticHelper {
  getTotalPayment(orders: Order[]) {
    if (orders.length === 0) return 0;
    return orders.reduce((total, order) => (total += order.totalPayment), 0);
  }
}
