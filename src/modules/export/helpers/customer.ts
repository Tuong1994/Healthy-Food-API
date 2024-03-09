import { UserAddress } from '@prisma/client';
import { ELang, ERole } from 'src/common/enum/base';
import { EGender } from 'src/modules/user/user.enum';
import utils from 'src/utils';

export const getGender = (gender: EGender, langCode: ELang) => {
  const lang = utils.getLang(langCode);
  return gender === EGender.MALE ? lang.excel.gender.male : lang.excel.gender.female;
};

export const getRole = (role: ERole, langCode: ELang) => {
  const lang = utils.getLang(langCode);
  if (role === ERole.MANAGER) return lang.excel.role.manager;
  if (role === ERole.LEADER) return lang.excel.role.leader;
  if (role === ERole.STAFF) return lang.excel.role.staff;
  return lang.excel.role.customer;
};

export const getAddress = (address: UserAddress, langCode: ELang) => {
  const lang = utils.getLang(langCode);
  return langCode === ELang.EN ? address.fullAddressEn : address.fullAddressVn;
};
