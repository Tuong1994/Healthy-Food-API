import { IsNotEmpty, IsOptional } from 'class-validator';

export class ShipmentDto {
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  orderId: string;

  @IsOptional()
  shipmentNumber: string;
}
