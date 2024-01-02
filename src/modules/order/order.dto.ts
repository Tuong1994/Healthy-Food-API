import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { EOrderPaymentStatus, EOrderPaymentMethod, EOrderStatus } from './order.enum';

class OrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  productId: string;

  @IsOptional()
  id: string;

  @IsOptional()
  orderId: string;
}

export class OrderDto {
  @IsOptional()
  orderNumber: string;

  @IsNotEmpty()
  status: EOrderStatus;

  @IsNotEmpty()
  paymentMethod: EOrderPaymentMethod;

  @IsNotEmpty()
  paymentStatus: EOrderPaymentStatus;

  @IsNotEmpty()
  customerId: string;

  @IsArray()
  items: OrderItemDto[];
}
