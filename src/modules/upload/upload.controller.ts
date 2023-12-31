import {
  Controller,
  Delete,
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

@Controller('api/upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('customer')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('image', multerOption()))
  @HttpCode(HttpStatus.OK)
  customerUpload(@Query() query: QueryDto, @UploadedFile() file: Express.Multer.File) {
    return this.uploadService.customerUpload(query, file);
  }

  @Post('product')
  @Roles(ERole.ADMIN, ERole.SUPER_ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('image', multerOption()))
  @HttpCode(HttpStatus.OK)
  productUpload(@Query() query: QueryDto, @UploadedFile() file: Express.Multer.File) {
    return this.uploadService.productUpload(query, file);
  }

  @Delete('remove')
  @Roles(ERole.ADMIN, ERole.SUPER_ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeImages(@Query() query: QueryDto) {
    return this.uploadService.removeImages(query);
  }

  @Delete('removePermanent')
  @Roles(ERole.SUPER_ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeImagesPermanent(@Query() query: QueryDto) {
    return this.uploadService.removeImagesPermanent(query);
  }

  @Post('restore')
  @Roles(ERole.SUPER_ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  restoreImages() {
    return this.uploadService.restoreImages();
  }
}
