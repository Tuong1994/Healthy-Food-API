import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { QueryDto } from 'src/common/dto/query.dto';
import { multerOption } from 'src/common/config/multer.config';
import { Roles } from 'src/common/decorator/role.decorator';
import { ERole } from 'src/common/enum/base';
import { RoleGuard } from 'src/common/guard/role.guard';
import { QueryPaging } from 'src/common/decorator/query.decorator';

@Controller('api/upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  getImages(@QueryPaging() query: QueryDto) {
    return this.uploadService.getImages(query);
  }

  @Post('user')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('image', multerOption()))
  @HttpCode(HttpStatus.OK)
  userUpload(@Query() query: QueryDto, @UploadedFile() file: Express.Multer.File) {
    return this.uploadService.userUpload(query, file);
  }

  @Post('product')
  @Roles(ERole.STAFF, ERole.LEADER, ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('image', multerOption()))
  @HttpCode(HttpStatus.OK)
  productUpload(@Query() query: QueryDto, @UploadedFile() file: Express.Multer.File) {
    return this.uploadService.productUpload(query, file);
  }

  @Delete('remove')
  @Roles(ERole.STAFF, ERole.LEADER, ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeImages(@Query() query: QueryDto) {
    return this.uploadService.removeImages(query);
  }

  @Delete('removePermanent')
  @Roles(ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeImagesPermanent(@Query() query: QueryDto) {
    return this.uploadService.removeImagesPermanent(query);
  }

  @Post('restore')
  @Roles(ERole.LEADER, ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  restoreImages() {
    return this.uploadService.restoreImages();
  }
}
