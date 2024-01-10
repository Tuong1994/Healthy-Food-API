import { Order } from '@prisma/client';
import { EOrderPaymentMethod, EOrderPaymentStatus, EOrderStatus } from '../../src/modules/order/order.enum';

const orders: Order[] = [
  {
    id: 'O_1',
    orderNumber: `#O_${Date.now()}`,
    status: EOrderStatus.WAITTING,
    paymentMethod: EOrderPaymentMethod.TRANSFER,
    paymentStatus: EOrderPaymentStatus.UNPAID,
    customerId: 'CUS_3',
    note: 'Be careful',
    isDelete: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'O_2',
    orderNumber: `#O_${Date.now()}`,
    status: EOrderStatus.DELIVERING,
    paymentMethod: EOrderPaymentMethod.CASH,
    paymentStatus: EOrderPaymentStatus.PAID,
    customerId: 'CUS_1',
    note: '',
    isDelete: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'O_3',
    orderNumber: `#O_${Date.now()}`,
    status: EOrderStatus.DELIVERED,
    paymentMethod: EOrderPaymentMethod.COD,
    paymentStatus: EOrderPaymentStatus.PAID,
    customerId: 'CUS_2',
    note: '',
    isDelete: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default orders