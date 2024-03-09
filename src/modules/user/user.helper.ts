import { Injectable } from '@nestjs/common';
import { ELang } from 'src/common/enum/base';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserHelper {
  constructor(private prisma: PrismaService) {}

  getFullName(firstName: string, lastName: string, langCode: ELang) {
    if (!firstName && !lastName) return '';
    if (!firstName && lastName) return '';
    if (firstName && !lastName) return '';
    if (langCode === ELang.EN) return `${lastName} ${firstName}`;
    else return `${firstName} ${lastName}`;
  }

  async getFullAddress(
    address: string,
    cityCode: number,
    districtCode: number,
    wardCode: number,
    langCode: ELang,
  ) {
    let city: any;
    let district: any;
    let ward: any;
    const selectFields = { nameEn: true, nameVn: true };
    if (cityCode) {
      city = await this.prisma.city.findFirst({ where: { code: cityCode }, select: { ...selectFields } });
    }
    if (districtCode) {
      district = await this.prisma.district.findFirst({
        where: { code: districtCode },
        select: { ...selectFields },
      });
    }
    if (wardCode) {
      ward = await this.prisma.ward.findFirst({ where: { code: wardCode }, select: { ...selectFields } });
    }
    if (!city || !district || !ward) return '';
    const isEnglish = langCode === ELang.EN;
    const addressInfo = address ? `${address}, ` : '';
    const cityName = city ? `${isEnglish ? city.nameEn : city.nameVn}` : '';
    const districtName = district ? `${isEnglish ? district.nameEn : district.nameVn}, ` : '';
    const wardName = ward ? `${isEnglish ? ward.nameEn : ward.nameVn}, ` : '';
    return addressInfo + wardName + districtName + cityName;
  }

  convertAddress<M>(record: M, langCode: ELang) {
    if (!record) return null;
    const recordClone = { ...record };
    delete record['addressEn'];
    delete record['addressVn'];
    delete record['fullAddressEn'];
    delete record['fullAddressVn'];
    const data = {
      address: langCode === ELang.EN ? recordClone['addressEn'] : recordClone['addressVn'],
      fullAddress: langCode === ELang.EN ? recordClone['fullAddressEn'] : recordClone['fullAddressVn'],
      ...record,
    };
    return data;
  }
}
