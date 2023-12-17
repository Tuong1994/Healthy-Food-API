import { IsNotEmpty, IsNumber } from 'class-validator';
import { ELang } from 'src/common/enum/base';
import { EInventoryStatus, EProductStatus, EProductUnit } from './product.enum';

export class ProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  unit: EProductUnit;

  @IsNotEmpty()
  langCode: ELang;

  @IsNotEmpty()
  @IsNumber()
  costPrice: number;

  @IsNotEmpty()
  @IsNumber()
  profit: number;

  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;

  @IsNotEmpty()
  status: EProductStatus;

  @IsNotEmpty()
  @IsNumber()
  inventory: number;

  @IsNotEmpty()
  inventoryStatus: EInventoryStatus;

  @IsNotEmpty()
  subCategoryId: string;
}
