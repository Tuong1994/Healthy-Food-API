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
import { SubCategoryService } from './subcategory.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { QueryPaging } from 'src/common/decorator/query.decorator';
import { SubCategoryDto } from './subcategory.dto';
import { Roles } from 'src/common/decorator/role.decorator';
import { ERole } from 'src/common/enum/base';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { RoleGuard } from 'src/common/guard/role.guard';

@Controller('api/subcategory')
export class SubCategoryController {
  constructor(private subCategoryService: SubCategoryService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  getSubCategories(@Query() query: QueryDto) {
    return this.subCategoryService.getSubCategories(query);
  }

  @Get('listPaging')
  @HttpCode(HttpStatus.OK)
  getSubCategoriesPaging(@QueryPaging() query: QueryDto) {
    return this.subCategoryService.getSubCategoriesPaging(query);
  }

  @Get('detail')
  @HttpCode(HttpStatus.OK)
  getSubCategory(@Query() query: QueryDto) {
    return this.subCategoryService.getSubCategory(query);
  }

  @Post('create')
  @Roles(ERole.ADMIN, ERole.SUPER_ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  createSubCategory(@Query() query: QueryDto, @Body() subCategory: SubCategoryDto) {
    return this.subCategoryService.createSubCategory(query, subCategory);
  }

  @Put('update')
  @Roles(ERole.ADMIN, ERole.SUPER_ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  updateSubCategory(@Query() query: QueryDto, @Body() subCategory: SubCategoryDto) {
    return this.subCategoryService.updateSubCategory(query, subCategory);
  }

  @Delete('remove')
  @Roles(ERole.SUPER_ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeSubCategories(@Query() query: QueryDto) {
    return this.subCategoryService.removeSubCategories(query);
  }
}
