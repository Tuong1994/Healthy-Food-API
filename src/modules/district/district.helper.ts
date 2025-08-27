import { Injectable } from '@nestjs/common';
import { District, Prisma } from '@prisma/client';
import { ELang } from 'src/common/enum/base';
import utils from 'src/utils';

@Injectable()
export class DistrictHelper {
  getSelectFields(langCode: ELang): Prisma.DistrictSelect {
    return {
      id: true,
      nameEn: langCode === ELang.EN,
      nameVn: langCode === ELang.VN,
      code: true,
      cityCode: true,
      isDelete: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  convertCollection(districts: District[], langCode: ELang) {
    return districts.map((district) => ({
      ...utils.convertRecordsName<District>(district, langCode),
    }));
  }
}
