import { IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CustomerDto {
  @IsNotEmpty()
  account: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  role: string;

  @IsOptional()
  email: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  @IsNumber()
  gender: number;

  @IsOptional()
  birthday: string;

  @IsOptional()
  address: string;

  @IsOptional()
  cityCode: string;

  @IsOptional()
  districtCode: string;

  @IsOptional()
  wardCode: string;
}
