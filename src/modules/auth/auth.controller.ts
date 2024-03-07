import { Controller, Post, Body, Query, HttpCode, HttpStatus, UseGuards, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, AuthChangePasswordDto, AuthForgotPasswordDto, AuthResetPasswordDto } from './auth.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { JwtGuard } from 'src/common/guard/jwt.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signUp')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() auth: AuthDto) {
    return this.authService.signUp(auth);
  }

  @Post('signIn')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() auth: AuthDto) {
    return this.authService.signIn(auth);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Query() query: QueryDto) {
    return this.authService.refresh(query);
  }

  @Post('changePassword')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  changePassword(@Query() query: QueryDto, @Body() password: AuthChangePasswordDto) {
    return this.authService.changePassword(query, password);
  }

  @Post('forgotPassword')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Query() query: QueryDto, @Body() data: AuthForgotPasswordDto) {
    return this.authService.forgotPassword(query, data);
  }

  @Put('resetPassword')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() data: AuthResetPasswordDto) {
    return this.authService.resetPassword(data);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Query() query: QueryDto) {
    return this.authService.logout(query);
  }
}
