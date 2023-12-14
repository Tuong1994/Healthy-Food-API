import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class ImageDto {
  @IsNotEmpty()
  path: string;

  @IsNotEmpty()
  @IsNumber()
  size: number;

  @IsNotEmpty()
  publicId: string;

  @IsOptional()
  customerId: string;

  @IsOptional()
  productId: string;
}
