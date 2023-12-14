import { IsNotEmpty } from 'class-validator';

export class SubCategoryDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  categoryId: string;
}
