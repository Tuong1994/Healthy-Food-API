import { IsNotEmpty } from 'class-validator';

export class LikeDto {
  @IsNotEmpty()
  customerId: string;

  @IsNotEmpty()
  productId: string;
}
