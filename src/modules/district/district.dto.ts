import { IsNotEmpty } from 'class-validator';
import { ELang } from 'src/common/enum/base';

export class DistrictDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  code: number;

  @IsNotEmpty()
  cityCode: number;

  @IsNotEmpty()
  langCode: ELang;
}
