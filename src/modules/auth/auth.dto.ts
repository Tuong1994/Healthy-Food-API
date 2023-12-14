import { IsNotEmpty, IsOptional } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  account: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  email: string;
}
