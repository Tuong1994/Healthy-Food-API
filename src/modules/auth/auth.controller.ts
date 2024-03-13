import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Put,
  Res,
  Req,
} from '@nestjs/common';
import { AuthDto, AuthChangePasswordDto, AuthForgotPasswordDto, AuthResetPasswordDto } from './auth.dto';
import { AuthService } from './auth.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { Request, Response } from 'express';

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
  signIn(@Res() res: Response, @Query() query: QueryDto, @Body() auth: AuthDto) {
    return this.authService.signIn(res, query, auth);
  }

  @Get('authenticate')
  @HttpCode(HttpStatus.OK)
  authenticate(@Req() req: Request) {
    return this.authService.authenticate(req);
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
  logout(@Res() res: Response, @Query() query: QueryDto) {
    return this.authService.logout(res, query);
  }
}
