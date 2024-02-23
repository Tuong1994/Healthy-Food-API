import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { CustomerAddress } from '@prisma/client';
import { CustomerResponse } from './customer.type';
import { CustomerDto } from 'src/modules/customer/customer.dto';
import { ELang } from 'src/common/enum/base';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import helper from 'src/helper';
import utils from 'src/utils';

@Injectable()
export class CustomerService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  private getSelectFields() {
    return {
      id: true,
      email: true,
      phone: true,
      firstName: true,
      lastName: true,
      fullName: true,
      gender: true,
      birthday: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  private getSelectAddressFields(langCode: ELang) {
    return {
      id: true,
      addressEn: true,
      addressVn: true,
      fullAddressEn: langCode === ELang.EN,
      fullAddressVn: langCode === ELang.VN,
      cityCode: true,
      districtCode: true,
      wardCode: true,
      customerId: true,
    };
  }

  private convertCollection(customers: CustomerResponse[], langCode: ELang) {
    return customers.map((customer) => ({
      ...customer,
      address:
        'address' in customer
          ? utils.convertAddress<CustomerAddress>(customer.address as CustomerAddress, langCode)
          : null,
    }));
  }

  async getCustomers(query: QueryDto) {
    const { page, limit, langCode, keywords, sortBy, gender, role } = query;
    let collection: Paging<CustomerResponse> = utils.defaultCollection();
    const customers = await this.prisma.customer.findMany({
      where: {
        AND: [
          { gender: gender && Number(gender) },
          { role: role && Number(role) },
          { isDelete: { equals: false } },
        ],
      },
      select: {
        ...this.getSelectFields(),
        address: { select: { ...this.getSelectAddressFields(langCode) } },
        image: { select: { id: true, path: true, size: true, publicId: true } },
      },
      orderBy: [{ updatedAt: helper.getSortBy(sortBy) ?? 'desc' }],
    });
    if (keywords) {
      const filterCustomers = customers.filter(
        (customer) =>
          customer.firstName.toLowerCase().includes(keywords.toLowerCase()) ||
          customer.lastName.toLowerCase().includes(keywords.toLowerCase()) ||
          customer.fullName.toLowerCase().includes(keywords.toLowerCase()) ||
          customer.phone.toLowerCase().includes(keywords.toLowerCase()) ||
          customer.email.toLowerCase().includes(keywords.toLowerCase()),
      );
      collection = utils.paging<CustomerResponse>(filterCustomers, page, limit);
    } else collection = utils.paging<CustomerResponse>(customers, page, limit);
    const items = this.convertCollection(collection.items, langCode);
    return { ...collection, items };
  }

  async getCustomer(query: QueryDto) {
    const { customerId, langCode } = query;
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId, isDelete: { equals: false } },
      select: {
        ...this.getSelectFields(),
        address: { select: { ...this.getSelectAddressFields(langCode) } },
        image: { select: { id: true, path: true, size: true, publicId: true } },
      },
    });
    return {
      ...customer,
      address: customer.address
        ? {
            addressEn: customer.address.addressEn,
            addressVn: customer.address.addressVn,
            ...utils.convertAddress(customer.address, langCode),
          }
        : null,
    };
  }

  async createCustomer(query: QueryDto, file: Express.Multer.File, customer: CustomerDto) {
    const { langCode } = query;
    const { email, password, role, firstName, lastName, phone, gender, birthday, address } = customer;

    const fullName = helper.getFullName(firstName, lastName, langCode);
    const newCustomer = await this.prisma.customer.create({
      data: {
        email,
        password: utils.bcryptHash(password),
        firstName,
        lastName,
        fullName,
        phone,
        birthday,
        role: role && Number(role),
        gender: gender && Number(gender),
        isDelete: false,
      },
      include: {
        address: true,
        image: true,
      },
    });

    if (newCustomer) {
      let responseCustomer: any;
      if (address) {
        const addressJson = utils.parseJSON<CustomerAddress>(address);
        const { addressEn, addressVn, cityCode, districtCode, wardCode } = addressJson;
        const fullAddressEn = await helper.getFullAddress(
          addressEn,
          Number(cityCode),
          Number(districtCode),
          Number(wardCode),
          ELang.EN,
        );
        const fullAddressVn = await helper.getFullAddress(
          addressEn,
          Number(cityCode),
          Number(districtCode),
          Number(wardCode),
          ELang.VN,
        );
        await this.prisma.customerAddress.create({
          data: {
            addressEn,
            addressVn,
            fullAddressEn,
            fullAddressVn,
            cityCode: cityCode && Number(cityCode),
            districtCode: districtCode && Number(districtCode),
            wardCode: wardCode && Number(wardCode),
            customerId: newCustomer.id,
            isDelete: false,
          },
        });
        responseCustomer = await this.prisma.customer.findUnique({
          where: { id: newCustomer.id },
          include: { address: true },
        });
      }

      if (file) {
        const result = await this.cloudinary.upload(utils.getFileUrl(file));
        const image = utils.generateImage(result, { customerId: newCustomer.id });
        await this.prisma.image.create({ data: { ...image, isDelete: false } });
        responseCustomer = await this.prisma.customer.findUnique({
          where: { id: newCustomer.id },
          include: { address: true, image: true },
        });
      }
      return responseCustomer ? responseCustomer : newCustomer;
    }
  }

  async updateCustomer(query: QueryDto, file: Express.Multer.File, customer: CustomerDto) {
    const { customerId, langCode } = query;
    const { role, firstName, lastName, phone, gender, birthday, address } = customer;

    const fullName = helper.getFullName(firstName, lastName, langCode);
    await this.prisma.customer.update({
      where: { id: customerId },
      data: {
        firstName,
        lastName,
        fullName,
        phone,
        birthday,
        gender: gender && Number(gender),
        role: role && Number(role),
      },
    });

    if (address) {
      const addressJson = utils.parseJSON<CustomerAddress>(address);
      const { addressEn, addressVn, cityCode, districtCode, wardCode } = addressJson;
      const fullAddressEn = await helper.getFullAddress(
        addressEn,
        Number(cityCode),
        Number(districtCode),
        Number(wardCode),
        ELang.EN,
      );
      const fullAddressVn = await helper.getFullAddress(
        addressVn,
        Number(cityCode),
        Number(districtCode),
        Number(wardCode),
        ELang.VN,
      );
      const customerAddress = await this.prisma.customerAddress.findUnique({ where: { customerId } });
      const data = {
        addressEn,
        addressVn,
        fullAddressEn,
        fullAddressVn,
        customerId,
        isDelete: false,
        cityCode: cityCode && Number(cityCode),
        districtCode: districtCode && Number(districtCode),
        wardCode: wardCode && Number(wardCode),
      };
      if (!customerAddress) {
        await this.prisma.customerAddress.create({ data });
      } else {
        await this.prisma.customerAddress.update({
          where: { customerId },
          data,
        });
      }
    }

    if (file) {
      const updateCustomer = await this.prisma.customer.findUnique({
        where: { id: customerId },
        select: { image: true },
      });
      const result = await this.cloudinary.upload(utils.getFileUrl(file));
      const image = utils.generateImage(result, { customerId });
      if (updateCustomer.image) {
        await this.cloudinary.destroy(updateCustomer.image.publicId);
        await this.prisma.image.update({ where: { customerId }, data: image });
      } else {
        await this.prisma.image.create({ data: { ...image, isDelete: false } });
      }
    }

    throw new HttpException('Updated success', HttpStatus.OK);
  }

  async removeCustomers(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const customers = await this.prisma.customer.findMany({
      where: { id: { in: listIds } },
      select: { id: true, image: true, address: true },
    });
    if (customers && !customers.length) throw new HttpException('Customers not found', HttpStatus.NOT_FOUND);
    await this.prisma.customer.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    await Promise.all(
      customers.map(async (customer) => {
        if (customer.image)
          await this.prisma.image.update({ where: { customerId: customer.id }, data: { isDelete: true } });
        if (customer.address)
          await this.prisma.customerAddress.update({
            where: { customerId: customer.id },
            data: { isDelete: true },
          });
      }),
    );
    throw new HttpException('Removed success', HttpStatus.OK);
  }

  async removeAddress(query: QueryDto) {
    const { customerId } = query;
    const address = await this.prisma.customerAddress.findUnique({ where: { customerId } });
    if (!address) throw new HttpException('Address not found', HttpStatus.NOT_FOUND);
    await this.prisma.customerAddress.delete({ where: { customerId } });
    throw new HttpException('Removed susscess', HttpStatus.OK);
  }

  async removeCustomersPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const customers = await this.prisma.customer.findMany({
      where: { id: { in: listIds } },
      include: { image: true },
    });
    if (customers && !customers.length) throw new HttpException('Customers not found', HttpStatus.NOT_FOUND);
    await this.prisma.customer.deleteMany({ where: { id: { in: listIds } } });
    await Promise.all(
      customers.map(async (customer) => {
        if (!customer.image) return;
        await this.cloudinary.destroy(customer.image.publicId);
      }),
    );
    throw new HttpException('Removed success', HttpStatus.OK);
  }

  async restoreCustomers() {
    const customers = await this.prisma.customer.findMany({
      where: { isDelete: { equals: true } },
      select: { id: true, address: true, image: true },
    });
    if (customers && !customers.length)
      throw new HttpException('There are no data to restored', HttpStatus.OK);
    await Promise.all(
      customers.map(async (customer) => {
        await this.prisma.customer.update({ where: { id: customer.id }, data: { isDelete: false } });
        if (customer.address)
          await this.prisma.customerAddress.update({
            where: { customerId: customer.id },
            data: { isDelete: false },
          });
        if (customer.image)
          await this.prisma.image.update({ where: { customerId: customer.id }, data: { isDelete: false } });
      }),
    );
    throw new HttpException('Restored success', HttpStatus.OK);
  }
}
