import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

class CartItemDto {
  @IsNotEmpty()
  @IsNumber()
  quanity: number;

  @IsNotEmpty()
  productId: string;

  @IsOptional()
  id: string;

  @IsOptional()
  cartId: string;
}

export class CartDto {
  @IsNotEmpty()
  customerId: string;

  @IsArray()
  items: CartItemDto[];
}
