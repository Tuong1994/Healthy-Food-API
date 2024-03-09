import { Controller, Get, HttpCode, HttpStatus, Query, Res, UseGuards } from '@nestjs/common';
import { ExportService } from './export.service';
import { Response } from 'express';
import { QueryDto } from 'src/common/dto/query.dto';
import { JwtGuard } from 'src/common/guard/jwt.guard';

@Controller('api/export')
export class ExportController {
  constructor(private exportService: ExportService) {}

  @Get('user')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  userExport(@Query() query: QueryDto, @Res() res: Response) {
    return this.exportService.userExport(query, res);
  }

  @Get('category')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  categoryExport(@Query() query: QueryDto, @Res() res: Response) {
    return this.exportService.categoryExport(query, res);
  }

  @Get('subCategory')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  subCategoryExport(@Query() query: QueryDto, @Res() res: Response) {
    return this.exportService.subCategoryExport(query, res);
  }

  @Get('product')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  productExport(@Query() query: QueryDto, @Res() res: Response) {
    return this.exportService.productExport(query, res);
  }

  @Get('order')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  orderExport(@Query() query: QueryDto, @Res() res: Response) {
    return this.exportService.orderExport(query, res);
  }

  @Get('shipment')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  shipmentExport(@Query() query: QueryDto, @Res() res: Response) {
    return this.exportService.shipmentExport(query, res);
  }
}
