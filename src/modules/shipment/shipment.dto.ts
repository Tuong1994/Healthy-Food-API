import { IsNotEmpty } from 'class-validator';

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
}
