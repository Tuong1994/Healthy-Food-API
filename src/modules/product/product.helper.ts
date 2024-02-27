import { Injectable } from '@nestjs/common';
import { Rate } from '@prisma/client';

@Injectable()
export class ProductHelper {
  getRatePoints(rates: Rate[]) {
    if (rates.length === 0) return 0;
    const oneRates = rates.filter((rate) => rate.point === 1).length;
    const twoRates = rates.filter((rate) => rate.point === 2).length;
    const threeRates = rates.filter((rate) => rate.point === 3).length;
    const fourRates = rates.filter((rate) => rate.point === 4).length;
    const fiveRates = rates.filter((rate) => rate.point === 5).length;
    const totalPoint = oneRates * 1 + twoRates * 2 + threeRates * 3 + fourRates * 4 + fiveRates * 5;
    const totalRes = oneRates + twoRates + threeRates + fourRates + fiveRates;
    return Math.ceil(totalPoint / totalRes);
  }
}
