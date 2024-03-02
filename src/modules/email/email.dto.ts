import { Order, OrderItem, Shipment } from '@prisma/client';
import { IsArray, IsEmail, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class EmailContactDto {
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  phone: string;
}

export class EmailOrderDto {
  @IsNotEmpty()
  email: string;

  @IsObject()
  order: Order;

  @IsArray()
  items: OrderItem[];

  @IsOptional()
  @IsObject()
  shipment: Shipment;
}
