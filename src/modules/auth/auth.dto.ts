import { IsNotEmpty, IsOptional } from 'class-validator';

export class AuthDto {
  @IsOptional()
  email: string;
  
  @IsNotEmpty()
  password: string;

  @IsOptional()
  phone: string;
}
