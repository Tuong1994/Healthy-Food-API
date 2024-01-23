import { Order } from '@prisma/client';
import {
  EOrderPaymentMethod,
  EOrderPaymentStatus,
  EOrderStatus,
  ERecievedType,
} from '../../src/modules/order/order.enum';

const orders: Order[] = [
  {
    id: 'O_1',
    orderNumber: `#O_${Date.now()}`,
    status: EOrderStatus.WAITTING,
    paymentMethod: EOrderPaymentMethod.TRANSFER,
    paymentStatus: EOrderPaymentStatus.UNPAID,
    recievedType: ERecievedType.STORE,
    shipmentFee: 0,
    totalPayment: 75000,
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
    recievedType: ERecievedType.STORE,
    shipmentFee: 0,
    totalPayment: 150000,
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
    recievedType: ERecievedType.DELIVERY,
    shipmentFee: 50000,
    totalPayment: 135000,
    customerId: 'CUS_2',
    note: '',
    isDelete: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default orders;
