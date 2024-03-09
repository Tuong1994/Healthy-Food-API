import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class RateDto {
  @IsNotEmpty()
  @IsNumber()
  point: number;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  productId: string;

  @IsOptional()
  note: string;
}
