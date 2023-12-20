import { Controller, Post, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';
import { QueryDto } from 'src/common/dto/query.dto';

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

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Query() query: QueryDto) {
    return this.authService.logout(query);
  }
}
