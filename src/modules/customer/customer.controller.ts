import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { QueryPaging } from 'src/common/decorator/query.decorator';
import { RoleGuard } from 'src/common/guard/role.guard';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { ERole } from 'src/common/enum/base';
import { CustomerDto } from 'src/modules/customer/customer.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOption } from 'src/common/config/multer.config';

@Controller('api/customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  getCustomers(@QueryPaging() query: QueryDto) {
    return this.customerService.getCustomers(query);
  }

  @Get('detail')
  @HttpCode(HttpStatus.OK)
  getCustomer(@Query() query: QueryDto) {
    return this.customerService.getCustomer(query);
  }

  @Post('create')
  @Roles(ERole.ADMIN, ERole.SUPER_ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('image', multerOption()))
  @HttpCode(HttpStatus.CREATED)
  createCustomer(
    @Query() query: QueryDto,
    @UploadedFile() file: Express.Multer.File,
    @Body() customer: CustomerDto,
  ) {
    return this.customerService.createCustomer(query, file, customer);
  }

  @Put('update')
  @Roles(ERole.ADMIN, ERole.SUPER_ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('image', multerOption()))
  @HttpCode(HttpStatus.OK)
  updateCustomer(
    @Query() query: QueryDto,
    @UploadedFile() file: Express.Multer.File,
    @Body() customer: CustomerDto,
  ) {
    return this.customerService.updateCustomer(query, file, customer);
  }

  @Delete('remove')
  @Roles(ERole.ADMIN, ERole.SUPER_ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeCustomers(@Query() query: QueryDto) {
    return this.customerService.removeCustomers(query);
  }

  @Delete('removePermanent')
  @Roles(ERole.SUPER_ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeCustomersPermanent(@Query() query: QueryDto) {
    return this.customerService.removeCustomersPermanent(query);
  }

  @Post('restore')
  @Roles(ERole.SUPER_ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  restoreCustomers() {
    return this.customerService.restoreCustomers();
  }
}
