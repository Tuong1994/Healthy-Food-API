import { Module } from '@nestjs/common';
import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';
import { StatisticHelper } from './statistic.helper';

@Module({
  controllers: [StatisticController],
  providers: [StatisticService, StatisticHelper],
})
export class StatisticModule {}
