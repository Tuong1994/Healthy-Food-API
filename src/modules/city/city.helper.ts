import { Injectable } from '@nestjs/common';
import { City, Prisma } from '@prisma/client';
import { ELang } from 'src/common/enum/base';
import utils from 'src/utils';

@Injectable()
export class CityHelper {
  getSelectFields(langCode: ELang): Prisma.CitySelect {
    return {
      id: true,
      nameEn: langCode === ELang.EN,
      nameVn: langCode === ELang.VN,
      code: true,
      isDelete: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  convertCollection(cities: City[], langCode: ELang) {
    return cities.map((city) => ({
      ...utils.convertRecordsName<City>(city, langCode),
    }));
  }
}
