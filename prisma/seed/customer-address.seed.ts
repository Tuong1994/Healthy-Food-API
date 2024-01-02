import { CustomerAddress } from '@prisma/client';

const customerAddresses: CustomerAddress[] = [
  {
    id: 'CUS_ADDR_1',
    addressEn: '79/24/13 Au Co Str',
    addressVn: '79/24/13 Âu Cơ',
    fullAddressEn: '79/24/13 Au Co Str, Ward 14, District 11, Hồ Chí Minh City',
    fullAddressVn: '79/24/13 Âu Cơ, Phường 14, Quận  11, Thành phố Hồ Chí Minh',
    cityCode: 79,
    districtCode: 772,
    wardCode: 26882,
    customerId: 'CUS_1',
    isDelete: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default customerAddresses;
