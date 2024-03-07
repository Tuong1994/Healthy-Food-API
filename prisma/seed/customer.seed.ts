import { Customer } from '@prisma/client';
import { ERole } from '../../src/common/enum/base';
import { EGender } from '../../src/modules/customer/customer.enum';
import utils from '../../src/utils';

const customers: Customer[] = [
  {
    id: 'CUS_1',
    email: 'nhambontuong68@gmail.com',
    password: utils.bcryptHash('123456'),
    firstName: 'Tuong',
    lastName: 'Anderson',
    fullName: 'Jack Anderson',
    phone: '0793229970',
    gender: EGender.MALE,
    birthday: '1994-11-28T00:00:00.000Z',
    role: ERole.SUPER_ADMIN,
    isDelete: false,
    resetToken: null,
    resetTokenExpires: null,
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
    birthday: '1997-11-28T00:00:00.000Z',
    role: ERole.ADMIN,
    isDelete: false,
    resetToken: null,
    resetTokenExpires: null,
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
    birthday: '1984-01-15T00:00:00.000Z',
    role: ERole.CUSTOMER,
    isDelete: false,
    resetToken: null,
    resetTokenExpires: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'CUS_4',
    email: 'bill@example.com',
    password: utils.bcryptHash('123456'),
    firstName: 'Bill',
    lastName: 'Batson',
    fullName: 'Bill Batson',
    phone: '0854266700',
    gender: EGender.MALE,
    birthday: '1994-01-15T00:00:00.000Z',
    role: ERole.CUSTOMER,
    isDelete: false,
    resetToken: null,
    resetTokenExpires: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'CUS_5',
    email: 'emily@example.com',
    password: utils.bcryptHash('123456'),
    firstName: 'Emily',
    lastName: 'Castle',
    fullName: 'Emily Castle',
    phone: '0793886671',
    gender: EGender.FEMALE,
    birthday: '1997-02-28T00:00:00.000Z',
    role: ERole.CUSTOMER,
    isDelete: false,
    resetToken: null,
    resetTokenExpires: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'CUS_6',
    email: 'anna@example.com',
    password: utils.bcryptHash('123456'),
    firstName: 'Anna',
    lastName: 'Pennyworth',
    fullName: 'Anna Pennyworth',
    phone: '0593886651',
    gender: EGender.FEMALE,
    birthday: '2000-11-15T00:00:00.000Z',
    role: ERole.CUSTOMER,
    isDelete: false,
    resetToken: null,
    resetTokenExpires: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'CUS_7',
    email: 'John@example.com',
    password: utils.bcryptHash('123456'),
    firstName: 'John',
    lastName: 'Drake',
    fullName: 'John Drake',
    phone: '0793886651',
    gender: EGender.MALE,
    birthday: '1999-09-28T00:00:00.000Z',
    role: ERole.CUSTOMER,
    isDelete: false,
    resetToken: null,
    resetTokenExpires: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'CUS_8',
    email: 'ben@example.com',
    password: utils.bcryptHash('123456'),
    firstName: 'Ben',
    lastName: 'Anderson',
    fullName: 'Ben Anderson',
    phone: '0793664475',
    gender: EGender.MALE,
    birthday: '1993-01-15T00:00:00.000Z',
    role: ERole.CUSTOMER,
    isDelete: false,
    resetToken: null,
    resetTokenExpires: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'CUS_9',
    email: 'eva@example.com',
    password: utils.bcryptHash('123456'),
    firstName: 'Eva',
    lastName: 'Queen',
    fullName: 'Eva Queen',
    phone: '0793886687',
    gender: EGender.FEMALE,
    birthday: '1990-11-15T00:00:00.000Z',
    role: ERole.CUSTOMER,
    isDelete: false,
    resetToken: null,
    resetTokenExpires: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'CUS_10',
    email: 'evan@example.com',
    password: utils.bcryptHash('123456'),
    firstName: 'Evan',
    lastName: 'Todd',
    fullName: 'Evan Todd',
    phone: '0293885541',
    gender: EGender.MALE,
    birthday: '1995-03-10T00:00:00.000Z',
    role: ERole.CUSTOMER,
    isDelete: false,
    resetToken: null,
    resetTokenExpires: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default customers