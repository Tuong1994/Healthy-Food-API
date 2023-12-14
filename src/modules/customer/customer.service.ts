import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { Customer } from '@prisma/client';
import { CustomerDto } from 'src/modules/customer/customer.dto';
import utils from 'src/utils';
import helper from 'src/helper';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async getCustomers(query: QueryDto) {
    const { page, limit, langCode, keywords, sortBy, gender, role } = query;
    let collection: Paging<Customer> = utils.defaultCollection();
    const customers = await this.prisma.customer.findMany({
      where: {
        AND: [{ gender }, { role }],
      },
      include: { address: { where: { langCode } } },
      orderBy: [{ updatedAt: helper.getSortBy(sortBy) ?? 'desc' }],
    });
    if (keywords) {
      const filterCustomers = customers.filter(
        (customer) =>
          customer.account.toLowerCase().includes(keywords.toLowerCase()) ||
          customer.firstName.toLowerCase().includes(keywords.toLowerCase()) ||
          customer.lastName.toLowerCase().includes(keywords.toLowerCase()) ||
          customer.fullName.toLowerCase().includes(keywords.toLowerCase()) ||
          customer.phone.toLowerCase().includes(keywords.toLowerCase()) ||
          customer.email.toLowerCase().includes(keywords.toLowerCase()),
      );
      collection = utils.paging<Customer>(filterCustomers, page, limit);
    } else collection = utils.paging<Customer>(customers, page, limit);
    return collection;
  }

  async getCustomer(query: QueryDto) {
    const { customerId, langCode } = query;
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      include: { address: { where: { langCode } } },
    });
    return customer;
  }

  async createCustomer(query: QueryDto, customer: CustomerDto) {
    const { langCode } = query;
    const {
      account,
      password,
      role,
      firstName,
      lastName,
      phone,
      email,
      gender,
      birthday,
      address,
      cityCode,
      districtCode,
      wardCode,
    } = customer;

    const fullName = helper.getFullName(firstName, lastName, langCode);
    const fullAddress = await helper.getFullAddress(address, cityCode, districtCode, wardCode, langCode);
    const newCustomer = await this.prisma.customer.create({
      data: {
        account,
        password: utils.bcryptHash(password),
        role: Number(role),
        firstName,
        lastName,
        fullName,
        phone,
        email,
        gender,
        birthday,
      },
    });

    if (newCustomer) {
      await this.prisma.customerAddress.create({
        data: {
          address,
          cityCode,
          districtCode,
          wardCode,
          langCode,
          fullAddress,
          customerId: newCustomer.id,
        },
      });
    }

    return newCustomer;
  }

  async updateCustomer(query: QueryDto, customer: CustomerDto) {
    const { customerId, langCode } = query;
    const {
      role,
      firstName,
      lastName,
      phone,
      email,
      gender,
      birthday,
      address,
      cityCode,
      districtCode,
      wardCode,
    } = customer;

    const fullName = helper.getFullName(firstName, lastName, langCode);
    const fullAddress = await helper.getFullAddress(address, cityCode, districtCode, wardCode, langCode);
    await this.prisma.customer.update({
      where: { id: customerId },
      data: {
        firstName,
        lastName,
        fullName,
        phone,
        email,
        gender,
        birthday,
        role: Number(role),
        address: {
          update: {
            where: { customerId },
            data: { address, fullAddress, cityCode, districtCode, wardCode, langCode },
          },
        },
      },
    });

    throw new HttpException('Updated success', HttpStatus.OK);
  }

  async removeCustomers(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const customers = await this.prisma.customer.findMany({ where: { id: { in: listIds } } });
    if (customers && customers.length > 0) {
      await this.prisma.customer.deleteMany({ where: { id: { in: listIds } } });
      throw new HttpException('Removed success', HttpStatus.OK);
    }
    throw new HttpException('Customers not found', HttpStatus.NOT_FOUND);
  }
}
