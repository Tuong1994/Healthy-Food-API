import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { StatisticService } from './statistic.service';

@Controller('api/statistic')
export class StatisticController {
  constructor(private statisticService: StatisticService) {}

  @Get('general')
  @HttpCode(HttpStatus.OK)
  getGeneral() {
    return this.statisticService.getGeneral();
  }

  @Get('recentOrders')
  @HttpCode(HttpStatus.OK)
  getRecentOrders() {
    return this.statisticService.getRecentOrders();
  }

  @Get('chartRevenue')
  @HttpCode(HttpStatus.OK)
  getChartRevenue() {
    return this.statisticService.getChartRevenue();
  }
}
