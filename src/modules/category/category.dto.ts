import { IsNotEmpty } from 'class-validator';

export class CategoryDto {
  @IsNotEmpty()
  nameEn: string;

  @IsNotEmpty()
  nameVn: string;
}
