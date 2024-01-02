import { IsNotEmpty, IsOptional } from 'class-validator';
import { EInventoryStatus, EProductOrigin, EProductStatus, EProductUnit } from './product.enum';

export class ProductDto {
  @IsNotEmpty()
  nameEn: string;

  @IsNotEmpty()
  nameVn: string;

  @IsNotEmpty()
  unit: EProductUnit;

  @IsNotEmpty()
  costPrice: string;

  @IsNotEmpty()
  profit: string;

  @IsNotEmpty()
  totalPrice: string;

  @IsNotEmpty()
  status: EProductStatus;

  @IsNotEmpty()
  inventory: string;

  @IsNotEmpty()
  inventoryStatus: EInventoryStatus;

  @IsNotEmpty()
  origin: EProductOrigin;

  @IsNotEmpty()
  supplier: string;

  @IsNotEmpty()
  categoryId: string;

  @IsNotEmpty()
  subCategoryId: string;

  @IsOptional()
  isNew: boolean;
}
