import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { EOrderPaymentStatus, EOrderPaymentMethod, EOrderStatus, EReceivedType } from './order.enum';

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

class ShipmentDto {
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  address: string;
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
  receivedType: EReceivedType;

  @IsNotEmpty()
  @IsNumber()
  shipmentFee: number;

  @IsNotEmpty()
  @IsNumber()
  totalPayment: number;

  @IsNotEmpty()
  userId: string;

  @IsOptional()
  note: string;

  @IsArray()
  items: OrderItemDto[];

  @IsOptional()
  shipment: ShipmentDto;
}
