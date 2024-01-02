import { IsNotEmpty } from 'class-validator';

export class SubCategoryDto {
  @IsNotEmpty()
  nameEn: string;

  @IsNotEmpty()
  nameVn: string;

  @IsNotEmpty()
  categoryId: string;
}
