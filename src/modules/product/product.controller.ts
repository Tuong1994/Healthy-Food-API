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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { QueryPaging } from 'src/common/decorator/query.decorator';
import { Roles } from 'src/common/decorator/role.decorator';
import { EPermission, ERole } from 'src/common/enum/base';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { ProductDto } from './product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOption } from 'src/common/config/multer.config';
import { Permission } from 'src/common/decorator/permission.decorator';
import { PermissionGuard } from 'src/common/guard/permission.guard';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('api/product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @SkipThrottle()
  @Get('list')
  @HttpCode(HttpStatus.OK)
  getProducts(@Query() query: QueryDto) {
    return this.productService.getProductsWithCategories(query);
  }

  @SkipThrottle()
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
  @Roles(ERole.STAFF, ERole.LEADER, ERole.MANAGER)
  @Permission(EPermission.CREATE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @UseInterceptors(FileInterceptor('image', multerOption()))
  @HttpCode(HttpStatus.CREATED)
  createProduct(@UploadedFile() file: Express.Multer.File, @Body() product: ProductDto) {
    return this.productService.createProduct(file, product);
  }

  @Put('update')
  @Roles(ERole.STAFF, ERole.LEADER, ERole.MANAGER)
  @Permission(EPermission.UPDATE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @UseInterceptors(FileInterceptor('image', multerOption()))
  @HttpCode(HttpStatus.OK)
  updateProduct(
    @Query() query: QueryDto,
    @UploadedFile() file: Express.Multer.File,
    @Body() product: ProductDto,
  ) {
    return this.productService.updateProduct(query, file, product);
  }

  @Delete('remove')
  @Roles(ERole.STAFF, ERole.LEADER, ERole.MANAGER)
  @Permission(EPermission.REMOVE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  removeProducts(@Query() query: QueryDto) {
    return this.productService.removeProducts(query);
  }

  @Delete('removePermanent')
  @Roles(ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeProductsPermanent(@Query() query: QueryDto) {
    return this.productService.removeProductsPermanent(query);
  }

  @Post('restore')
  @Roles(ERole.LEADER, ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  restoreProducts() {
    return this.productService.restoreProducts();
  }
}
