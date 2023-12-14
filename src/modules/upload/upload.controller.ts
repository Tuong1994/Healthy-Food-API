import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
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
  @UseInterceptors(FileInterceptor('image', multerOption('./assets/image/customer')))
  @HttpCode(HttpStatus.OK)
  customerUpload(@Query() query: QueryDto, @UploadedFile() file: Express.Multer.File) {
    return this.uploadService.customerUpload(query, file);
  }

  @Post('product')
  @Roles(ERole.ADMIN, ERole.SUPER_ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('images', multerOption('./assets/image/product')))
  @HttpCode(HttpStatus.OK)
  productUpload(@Query() query: QueryDto, @UploadedFiles() files: Express.Multer.File[]) {
    return this.uploadService.productUpload(query, files);
  }
}
