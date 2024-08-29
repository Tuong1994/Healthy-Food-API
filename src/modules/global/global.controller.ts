import { Controller, Get } from '@nestjs/common';
import { GlobalService } from './global.service';

@Controller('api/global')
export class GlobalController {
  constructor(private globalService: GlobalService) {}

  @Get('connection')
  connection() {
    return this.globalService.connection();
  }
}
