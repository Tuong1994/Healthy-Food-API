import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { EOrderPaymentStatus, EOrderPaymentType, EOrderStatus } from './order.enum';

class OrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  quanity: number;

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
  paymentType: EOrderPaymentType;

  @IsNotEmpty()
  paymentStatus: EOrderPaymentStatus;

  @IsNotEmpty()
  customerId: string;

  @IsArray()
  items: OrderItemDto[];
}
