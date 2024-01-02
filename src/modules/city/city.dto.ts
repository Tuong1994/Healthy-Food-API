import { IsNotEmpty } from 'class-validator';
import { ELang } from 'src/common/enum/base';

export class CityDto {
  @IsNotEmpty()
  nameEn: string;

  @IsNotEmpty()
  nameVn: string;

  @IsNotEmpty()
  code: number;
}
