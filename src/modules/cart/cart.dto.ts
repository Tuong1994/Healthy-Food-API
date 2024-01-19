import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

class CartItemDto {
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  productId: string;

  @IsOptional()
  id: string;

  @IsOptional()
  cartId: string;
}

export class CartDto {
  @IsOptional()
  @IsNotEmpty()
  customerId: string;

  @IsArray()
  items: CartItemDto[];
}
