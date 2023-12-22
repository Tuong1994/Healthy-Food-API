import { IsNotEmpty } from 'class-validator';
import { ELang } from 'src/common/enum/base';

export class CityDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  code: number;

  @IsNotEmpty()
  langCode: ELang;
}
