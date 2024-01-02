import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CityService } from './city.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { QueryPaging } from 'src/common/decorator/query.decorator';
import { Roles } from 'src/common/decorator/role.decorator';
import { ERole } from 'src/common/enum/base';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { CityDto } from './city.dto';

@Controller('api/city')
export class CityController {
  constructor(private cityService: CityService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  getCities(@Query() query: QueryDto) {
    return this.cityService.getCities(query);
  }

  @Get('listPaging')
  @HttpCode(HttpStatus.OK)
  getCitiesPaging(@QueryPaging() query: QueryDto) {
    return this.cityService.getCitiesPaging(query);
  }

  @Get('detail')
  @HttpCode(HttpStatus.OK)
  getCity(@Query() query: QueryDto) {
    return this.cityService.getCity(query);
  }

  @Post('create')
  @Roles(ERole.ADMIN, ERole.SUPER_ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  createCity(@Body() city: CityDto) {
    return this.cityService.createCity(city);
  }

  @Put('update')
  @Roles(ERole.ADMIN, ERole.SUPER_ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  updateCity(@Query() query: QueryDto, @Body() city: CityDto) {
    return this.cityService.updateCity(query, city);
  }

  @Delete('remove')
  @Roles(ERole.ADMIN, ERole.SUPER_ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeCities(@Query() query: QueryDto) {
    return this.cityService.removeCities(query);
  }

  @Delete('removePermanent')
  @Roles(ERole.SUPER_ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeCitiesPermanent(@Query() query: QueryDto) {
    return this.cityService.removeCities(query);
  }

  @Post('restore')
  @Roles(ERole.SUPER_ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  restoreCities() {
    return this.cityService.restoreCities();
  }
}
