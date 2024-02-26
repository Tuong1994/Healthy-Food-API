import { Controller, Get, HttpCode, HttpStatus, Query, Res, UseGuards } from '@nestjs/common';
import { ExportService } from './export.service';
import { Response } from 'express';
import { QueryDto } from 'src/common/dto/query.dto';
import { JwtGuard } from 'src/common/guard/jwt.guard';

@Controller('api/export')
export class ExportController {
  constructor(private exportService: ExportService) {}

  @Get('customer')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  customerExport(@Query() query: QueryDto, @Res() res: Response) {
    return this.exportService.customerExport(query, res);
  }
}
