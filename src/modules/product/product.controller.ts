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
import { ProductService } from './product.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { QueryPaging } from 'src/common/decorator/query.decorator';
import { Roles } from 'src/common/decorator/role.decorator';
import { ERole } from 'src/common/enum/base';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { ProductDto } from './product.dto';

@Controller('api/product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  getProducts(@Query() query: QueryDto) {
    return this.productService.getProducts(query);
  }

  @Get('listPaging')
  @HttpCode(HttpStatus.OK)
  getProductsPaging(@QueryPaging() query: QueryDto) {
    return this.productService.getProductsPaging(query);
  }

  @Get('detail')
  @HttpCode(HttpStatus.OK)
  getProduct(@Query() query: QueryDto) {
    return this.productService.getProduct(query);
  }

  @Post('create')
  @Roles(ERole.ADMIN, ERole.SUPER_ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  createProduct(@Query() query: QueryDto, @Body() product: ProductDto) {
    return this.productService.createProduct(query, product);
  }

  @Put('update')
  @Roles(ERole.ADMIN, ERole.SUPER_ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  updateProduct(@Query() query: QueryDto, @Body() product: ProductDto) {
    return this.productService.updateProduct(query, product);
  }

  @Delete('remove')
  @Roles(ERole.SUPER_ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeProducts(@Query() query: QueryDto) {
    return this.productService.removeProducts(query);
  }
}
