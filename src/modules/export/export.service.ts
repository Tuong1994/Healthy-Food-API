import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExcelService } from '../excel/excel.service';
import { EGender } from '../customer/customer.enum';
import { QueryDto } from 'src/common/dto/query.dto';
import { ELang, ERole } from 'src/common/enum/base';
import { CustomerAddress } from '@prisma/client';
import { WorkSheetColumns } from './export.type';
import { Response } from 'express';
import utils from 'src/utils';
import path from 'path';

@Injectable()
export class ExportService {
  constructor(
    private prisma: PrismaService,
    private excelService: ExcelService,
  ) {}

  private resHeaderContentTypeValue = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

  private resHeaderContentDispositionValue = 'attachment; filename=';

  async customerExport(query: QueryDto, res: Response) {
    const { langCode } = query;
    const lang = utils.getLang(langCode);

    const getGender = (gender: EGender) =>
      gender === EGender.MALE ? lang.excel.gender.male : lang.excel.gender.female;
    const getRole = (role: ERole) => {
      if (role === ERole.SUPER_ADMIN) return lang.excel.role.superAdmin;
      if (role === ERole.ADMIN) return lang.excel.role.admin;
      return lang.excel.role.customer;
    };
    const getAddress = (address: CustomerAddress) =>
      langCode === ELang.EN ? address.fullAddressEn : address.fullAddressVn;

    const customers = await this.prisma.customer.findMany({
      where: { isDelete: { equals: false } },
      select: {
        fullName: true,
        email: true,
        phone: true,
        gender: true,
        birthday: true,
        role: true,
        address: true,
      },
    });
    const exportData = customers.map((customer) => ({
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      birthday: customer.birthday,
      gender: getGender(customer.gender),
      role: getRole(customer.role),
      address: getAddress(customer.address),
    }));
    const columns: WorkSheetColumns = [
      { header: lang.excel.header.email, key: 'email' },
      { header: lang.excel.header.customerName, key: 'fullName' },
      { header: lang.excel.header.phone, key: 'phone' },
      { header: lang.excel.header.gender, key: 'gender' },
      { header: lang.excel.header.birthday, key: 'birthday' },
      { header: lang.excel.header.role, key: 'role' },
      { header: lang.excel.header.address, key: 'address' },
    ];

    const workBook = this.excelService.generateExcel(exportData, columns, 'Customers');
    const filePath = path.join(__dirname, '../../export-file/customers.xlsx');
    await workBook.xlsx.writeFile(filePath);
    res.setHeader('Content-Type', this.resHeaderContentTypeValue);
    res.setHeader('Content-Disposition', this.resHeaderContentDispositionValue + 'customers.xlsx');
    res.sendFile(filePath);
  }
}
