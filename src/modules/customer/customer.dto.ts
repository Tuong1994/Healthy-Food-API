import { IsNotEmpty, IsOptional } from 'class-validator';
import { ERole } from 'src/common/enum/base';
import { EGender } from './customer.enum';

export class CustomerDto {
  @IsOptional()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  role: ERole;

  @IsNotEmpty()
  phone: string;

  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  gender: EGender;

  @IsOptional()
  birthday: string;

  @IsOptional()
  addressEn: string;

  @IsOptional()
  addressVn: string

  @IsOptional()
  cityCode: string;

  @IsOptional()
  districtCode: string;

  @IsOptional()
  wardCode: string;
}
