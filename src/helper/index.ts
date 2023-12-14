import { Prisma, PrismaClient } from '@prisma/client';
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
    cityCode: string,
    districtCode: string,
    wardCode: string,
    langCode: ELang,
  ) => {
    const city = await prisma.city.findFirst({ where: { code: cityCode, langCode } });
    const district = await prisma.district.findFirst({ where: { code: districtCode, langCode } });
    const ward = await prisma.ward.findFirst({ where: { code: wardCode, langCode } });
    if (!city || !district || !ward) return '';
    return `${address} ${ward.name} ${district.name}s ${city.name}`;
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
};
export default helper;
