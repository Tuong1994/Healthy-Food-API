import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { RateService } from './rate.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { RateDto } from './rate.dto';
import { QueryPaging } from 'src/common/decorator/query.decorator';
import { Roles } from 'src/common/decorator/role.decorator';
import { ERole } from 'src/common/enum/base';
import { RoleGuard } from 'src/common/guard/role.guard';

@Controller('api/rate')
export class RateController {
  constructor(private rateService: RateService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  getRates(@QueryPaging() query: QueryDto) {
    return this.rateService.getRates(query);
  }

  @Get('listByCustomer')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getRatesByCustomer(@QueryPaging() query: QueryDto) {
    return this.rateService.getRatesByCustomer(query);
  }

  @Get('detail')
  @HttpCode(HttpStatus.OK)
  getRate(@Query() query: QueryDto) {
    return this.rateService.getRate(query);
  }

  @Post('create')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  createRate(@Body() rate: RateDto) {
    return this.rateService.createRate(rate);
  }

  @Put('update')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  updateRate(@Query() query: QueryDto, @Body() rate: RateDto) {
    return this.rateService.updateRate(query, rate);
  }

  @Delete('remove')
  @Roles(ERole.ADMIN, ERole.SUPER_ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeRates(@Query() query: QueryDto) {
    return this.rateService.removeRates(query);
  }

  @Delete('removePermanent')
  @Roles(ERole.SUPER_ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeRatesPermanent(@Query() query: QueryDto) {
    return this.rateService.removeRatesPermanent(query);
  }

  @Post('restore')
  @Roles(ERole.SUPER_ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  restoreRates() {
    return this.rateService.restoreRates();
  }
}
