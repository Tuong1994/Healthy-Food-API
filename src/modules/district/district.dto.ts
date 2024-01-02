import { IsNotEmpty } from 'class-validator';
import { ELang } from 'src/common/enum/base';

export class DistrictDto {
  @IsNotEmpty()
  nameEn: string;

  @IsNotEmpty()
  nameVn: string;

  @IsNotEmpty()
  code: number;

  @IsNotEmpty()
  cityCode: number;
}
