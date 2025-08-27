import { OrderItem, Prisma } from '@prisma/client';

export type OrderItems = Array<Omit<OrderItem, 'createdAt' | 'updatedAt'>>;

export type OrderWithPayload = Prisma.OrderGetPayload<{
  select: { id: true; items: true; shipment: true };
}>;
