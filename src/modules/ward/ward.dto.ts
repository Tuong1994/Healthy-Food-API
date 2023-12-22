import { IsNotEmpty } from 'class-validator';
import { ELang } from 'src/common/enum/base';

export class WardDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  code: number;

  @IsNotEmpty()
  districtCode: number;

  @IsNotEmpty()
  langCode: ELang;
}
