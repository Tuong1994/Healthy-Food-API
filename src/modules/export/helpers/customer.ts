import { CustomerAddress } from '@prisma/client';
import { ELang, ERole } from 'src/common/enum/base';
import { EGender } from 'src/modules/customer/customer.enum';
import utils from 'src/utils';

export const getGender = (gender: EGender, langCode: ELang) => {
  const lang = utils.getLang(langCode);
  return gender === EGender.MALE ? lang.excel.gender.male : lang.excel.gender.female;
};

export const getRole = (role: ERole, langCode: ELang) => {
  const lang = utils.getLang(langCode);
  if (role === ERole.SUPER_ADMIN) return lang.excel.role.superAdmin;
  if (role === ERole.ADMIN) return lang.excel.role.admin;
  return lang.excel.role.customer;
};

export const getAddress = (address: CustomerAddress, langCode: ELang) => {
  const lang = utils.getLang(langCode);
  return langCode === ELang.EN ? address.fullAddressEn : address.fullAddressVn;
};
