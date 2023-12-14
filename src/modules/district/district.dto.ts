import { IsNotEmpty } from 'class-validator';
import { ELang } from 'src/common/enum/base';

export class DistrictDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  cityCode: string;

  @IsNotEmpty()
  langCode: ELang;
}
