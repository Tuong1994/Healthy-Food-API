import { City, Order, Prisma, PrismaClient, Rate } from '@prisma/client';
import { ELang, ESort } from 'src/common/enum/base';

const prisma = new PrismaClient();

const helper = {
  getFullName: (firstName: string, lastName: string, langCode: ELang) => {
    if (!firstName && !lastName) return '';
    if (!firstName && lastName) return '';
    if (firstName && !lastName) return '';
    if (langCode === ELang.EN) return `${lastName} ${firstName}`;
    else return `${firstName} ${lastName}`;
  },

  getFullAddress: async (
    address: string,
    cityCode: number,
    districtCode: number,
    wardCode: number,
    langCode: ELang,
  ) => {
    let city: any;
    let district: any;
    let ward: any;
    const selectFields = { nameEn: true, nameVn: true };
    if (cityCode) {
      city = await prisma.city.findFirst({ where: { code: cityCode }, select: { ...selectFields } });
    }
    if (districtCode) {
      district = await prisma.district.findFirst({
        where: { code: districtCode },
        select: { ...selectFields },
      });
    }
    if (wardCode) {
      ward = await prisma.ward.findFirst({ where: { code: wardCode }, select: { ...selectFields } });
    }
    if (!city || !district || !ward) return '';
    const isEnglish = langCode === ELang.EN;
    const addressInfo = address ? `${address}, ` : '';
    const cityName = city ? `${isEnglish ? city.nameEn : city.nameVn}` : '';
    const districtName = district ? `${isEnglish ? district.nameEn : district.nameVn}, ` : '';
    const wardName = ward ? `${isEnglish ? ward.nameEn : ward.nameVn}, ` : '';
    return addressInfo + wardName + districtName + cityName;
  },

  getSortBy: (sort: number): Prisma.SortOrder => {
    const sorts: Record<number, string> = {
      [ESort.NEWEST]: 'desc',
      [ESort.OLDEST]: 'asc',
      [ESort.PRICE_GO_UP]: 'asc',
      [ESort.PRICE_GO_DOWN]: 'desc',
    };
    return sorts[sort] as Prisma.SortOrder;
  },

  getRatePoints: (rates: Rate[]) => {
    if (rates.length === 0) return 0;
    const oneRates = rates.filter((rate) => rate.point === 1).length;
    const twoRates = rates.filter((rate) => rate.point === 2).length;
    const threeRates = rates.filter((rate) => rate.point === 3).length;
    const fourRates = rates.filter((rate) => rate.point === 4).length;
    const fiveRates = rates.filter((rate) => rate.point === 5).length;
    const totalPoint = oneRates * 1 + twoRates * 2 + threeRates * 3 + fourRates * 4 + fiveRates * 5;
    const totalRes = oneRates + twoRates + threeRates + fourRates + fiveRates;
    return Math.ceil(totalPoint / totalRes);
  },

  getTotalPayment: (orders: Order[]) => {
    if (orders.length === 0) return 0;
    return orders.reduce((total, order) => (total += order.totalPayment), 0);
  },
};
export default helper;
