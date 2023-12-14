import { IsNotEmpty, IsOptional } from 'class-validator';

export class CommentDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  customerId: string;

  @IsNotEmpty()
  productId: string;

  @IsOptional()
  parentId: string;
}
