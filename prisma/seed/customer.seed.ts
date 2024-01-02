import { Customer } from '@prisma/client';
import { ERole } from '../../src/common/enum/base';
import { EGender } from '../../src/modules/customer/customer.enum';
import utils from '../../src/utils';

const customers: Customer[] = [
  {
    id: 'CUS_1',
    email: 'jack@example.com',
    password: utils.bcryptHash('123456'),
    firstName: 'Jack',
    lastName: 'Anderson',
    fullName: 'Jack Anderson',
    phone: '0793229970',
    gender: EGender.MALE,
    birthday: '28/11/1994',
    isDelete: false,
    role: ERole.SUPER_ADMIN,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'CUS_2',
    email: 'claire@example.com',
    password: utils.bcryptHash('123456'),
    firstName: 'Claire',
    lastName: 'Redfield',
    fullName: 'Claire Redfield',
    phone: '0593114491',
    gender: EGender.FEMALE,
    birthday: '28/11/1997',
    isDelete: false,
    role: ERole.ADMIN,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'CUS_3',
    email: 'kevin@example.com',
    password: utils.bcryptHash('123456'),
    firstName: 'Kevin',
    lastName: 'Kowalski',
    fullName: 'Kevin Kowalski',
    phone: '0793886681',
    gender: EGender.MALE,
    birthday: '15/01/1984',
    isDelete: false,
    role: ERole.CUSTOMER,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default customers