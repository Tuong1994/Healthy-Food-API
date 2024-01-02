import { IsNotEmpty } from 'class-validator';
import { ELang } from 'src/common/enum/base';

export class WardDto {
  @IsNotEmpty()
  nameEn: string;

  @IsNotEmpty()
  nameVn: string

  @IsNotEmpty()
  code: number;

  @IsNotEmpty()
  districtCode: number;
}
