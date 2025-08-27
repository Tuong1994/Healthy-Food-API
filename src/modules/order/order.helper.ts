import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ELang } from 'src/common/enum/base';
import { Prisma } from '@prisma/client';
import { OrderWithPayload } from './order.type';

@Injectable()
export class OrderHelper {
  constructor(private prisma: PrismaService) {}

  getSelectItemFields = (langCode: ELang): Prisma.OrderItemSelect => {
    return {
      id: true,
      quantity: true,
      productId: true,
      orderId: true,
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

  async handleUpdateIsDeleteOrder(order: OrderWithPayload, isDelete: boolean) {
    await this.prisma.order.update({ where: { id: order.id }, data: { isDelete } });
  }

  async handleUpdateIsDeleteOrderShipment(order: OrderWithPayload, isDelete: boolean) {
    await this.prisma.shipment.update({ where: { orderId: order.id }, data: { isDelete } });
  }

  async handleUpdateIsDeleteOrderItems(order: OrderWithPayload, isDelete: boolean) {
    await this.prisma.orderItem.updateMany({ where: { orderId: order.id }, data: { isDelete } });
  }
}
