import { IsNotEmpty } from 'class-validator';

export class LikeDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  productId: string;
}
