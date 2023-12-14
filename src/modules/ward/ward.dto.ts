import { IsNotEmpty } from 'class-validator';
import { ELang } from 'src/common/enum/base';

export class WardDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  districtCode: string;

  @IsNotEmpty()
  langCode: ELang;
}
