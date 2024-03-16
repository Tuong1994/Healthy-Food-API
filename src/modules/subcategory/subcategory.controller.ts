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
import { SubCategoryService } from './subcategory.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { QueryPaging } from 'src/common/decorator/query.decorator';
import { SubCategoryDto } from './subcategory.dto';
import { Roles } from 'src/common/decorator/role.decorator';
import { EPermission, ERole } from 'src/common/enum/base';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOption } from 'src/common/config/multer.config';
import { Permission } from 'src/common/decorator/permission.decorator';
import { PermissionGuard } from 'src/common/guard/permission.guard';

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
  @Roles(ERole.STAFF, ERole.LEADER, ERole.MANAGER)
  @Permission(EPermission.CREATE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @UseInterceptors(FileInterceptor('image', multerOption()))
  @HttpCode(HttpStatus.CREATED)
  createSubCategory(@UploadedFile() file: Express.Multer.File, @Body() subCategory: SubCategoryDto) {
    return this.subCategoryService.createSubCategory(file, subCategory);
  }

  @Put('update')
  @Roles(ERole.STAFF, ERole.LEADER, ERole.MANAGER)
  @Permission(EPermission.UPDATE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @UseInterceptors(FileInterceptor('image', multerOption()))
  @HttpCode(HttpStatus.OK)
  updateSubCategory(
    @Query() query: QueryDto,
    @UploadedFile() file: Express.Multer.File,
    @Body() subCategory: SubCategoryDto,
  ) {
    return this.subCategoryService.updateSubCategory(query, file, subCategory);
  }

  @Delete('remove')
  @Roles(ERole.STAFF, ERole.LEADER, ERole.MANAGER)
  @Permission(EPermission.REMOVE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  removeSubCategories(@Query() query: QueryDto) {
    return this.subCategoryService.removeSubCategories(query);
  }

  @Delete('removePermanent')
  @Roles(ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeSubCategoriesPermanent(@Query() query: QueryDto) {
    return this.subCategoryService.removeSubCategoriesPermanent(query);
  }

  @Post('restore')
  @Roles(ERole.LEADER, ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  restoreSubCategories() {
    return this.subCategoryService.restoreSubCategories();
  }
}
