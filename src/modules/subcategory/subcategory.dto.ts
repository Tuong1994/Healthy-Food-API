import { IsNotEmpty } from 'class-validator';
import { ERecordStatus } from 'src/common/enum/base';

export class SubCategoryDto {
  @IsNotEmpty()
  nameEn: string;

  @IsNotEmpty()
  nameVn: string;

  @IsNotEmpty()
  status: ERecordStatus;

  @IsNotEmpty()
  categoryId: string;
}
