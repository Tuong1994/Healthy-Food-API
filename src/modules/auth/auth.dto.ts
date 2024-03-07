import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  phone: string;
}

export class AuthChangePasswordDto {
  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  newPassword: string;
}

export class AuthForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class AuthResetPasswordDto {
  @IsNotEmpty()
  resetPassword: string;

  @IsNotEmpty()
  token: string;
}
