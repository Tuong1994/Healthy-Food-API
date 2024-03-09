import { IsNotEmpty, IsOptional } from 'class-validator';
import { ERole } from 'src/common/enum/base';
import { EGender } from './user.enum';

export class UserDto {
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
  address: string;
}
