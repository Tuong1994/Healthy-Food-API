import { OrderItem } from '@prisma/client';
import { ELang } from 'src/common/enum/base';
import {
  EOrderPaymentMethod,
  EOrderPaymentStatus,
  EOrderStatus,
  EReceivedType,
} from 'src/modules/order/order.enum';
import utils from 'src/utils';

export const getOrderStatus = (status: EOrderStatus, langCode: ELang) => {
  const lang = utils.getLang(langCode);
  const statuses: Record<number, string> = {
    [EOrderStatus.WAITTING]: lang.excel.orderStatus.waitting,
    [EOrderStatus.DELIVERING]: lang.excel.orderStatus.delivering,
    [EOrderStatus.DELIVERED]: lang.excel.orderStatus.delivered,
  };
  return statuses[status];
};

export const getPaymentMethod = (method: EOrderPaymentMethod, langCode: ELang) => {
  const lang = utils.getLang(langCode);
  const methods: Record<number, string> = {
    [EOrderPaymentMethod.TRANSFER]: lang.excel.paymentMethod.transfer,
    [EOrderPaymentMethod.CASH]: lang.excel.paymentMethod.cash,
    [EOrderPaymentMethod.COD]: lang.excel.paymentMethod.cod,
  };
  return methods[method];
};

export const getPaymentStatus = (status: EOrderPaymentStatus, langCode: ELang) => {
  const lang = utils.getLang(langCode);
  const statuses: Record<number, string> = {
    [EOrderPaymentStatus.UNPAID]: lang.excel.paymentStatus.unPaid,
    [EOrderPaymentStatus.PAID]: lang.excel.paymentStatus.paid,
  };
  return statuses[status];
};

export const getReceivedType = (type: EReceivedType, langCode: ELang) => {
  const lang = utils.getLang(langCode);
  const types: Record<number, string> = {
    [EReceivedType.STORE]: lang.excel.receivedType.store,
    [EReceivedType.DELIVERY]: lang.excel.receivedType.delivery,
  };
  return types[type];
};

export const getTotalProducts = (items: OrderItem[]) => {
  if (!items.length) return 0;
  return items.reduce((total, item) => {
    return (total += item.quantity);
  }, 0);
};
