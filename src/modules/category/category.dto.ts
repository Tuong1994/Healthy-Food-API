import { IsNotEmpty } from 'class-validator';
import { ERecordStatus } from 'src/common/enum/base';

export class CategoryDto {
  @IsNotEmpty()
  nameEn: string;

  @IsNotEmpty()
  nameVn: string;

  @IsNotEmpty()
  status: ERecordStatus;
}
