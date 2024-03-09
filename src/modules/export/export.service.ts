import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExcelService } from '../excel/excel.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Category, Product, SubCategory } from '@prisma/client';
import { WorkSheetColumns } from './export.type';
import { Response } from 'express';
import { getRecordStatus } from './helpers/common';
import { getAddress, getGender, getRole } from './helpers/customer';
import { getInventoryStatus, getProductOrigin, getProductUnit } from './helpers/product';
import {
  getOrderStatus,
  getPaymentMethod,
  getPaymentStatus,
  getReceivedType,
  getTotalProducts,
} from './helpers/order';
import utils from 'src/utils';
import moment = require('moment');

@Injectable()
export class ExportService {
  constructor(
    private prisma: PrismaService,
    private excelService: ExcelService,
  ) {}

  private resHeaderContentTypeValue = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

  private resHeaderContentDispositionValue = 'attachment; filename=';

  async userExport(query: QueryDto, res: Response) {
    const { langCode } = query;
    const lang = utils.getLang(langCode);

    const users = await this.prisma.user.findMany({
      where: { isDelete: { equals: false } },
      include: { address: true },
    });
    const exportData = users.map((user) => ({
      ...user,
      birthday: moment(user.birthday).format('DD/MM/YYYY'),
      gender: getGender(user.gender, langCode),
      role: getRole(user.role, langCode),
      address: user.address ? getAddress(user.address, langCode) : lang.excel.others.none,
    }));
    const columns: WorkSheetColumns = [
      { header: lang.excel.header.email, key: 'email' },
      { header: lang.excel.header.userName, key: 'fullName' },
      { header: lang.excel.header.phone, key: 'phone' },
      { header: lang.excel.header.gender, key: 'gender' },
      { header: lang.excel.header.birthday, key: 'birthday' },
      { header: lang.excel.header.role, key: 'role' },
      { header: lang.excel.header.address, key: 'address' },
    ];

    const { workBook } = this.excelService.generateExcel(exportData, columns, 'Users');
    const buffer = await workBook.xlsx.writeBuffer();
    res.setHeader('Content-Type', this.resHeaderContentTypeValue);
    res.setHeader('Content-Disposition', this.resHeaderContentDispositionValue + 'users.xlsx');
    res.send(buffer);
  }

  async categoryExport(query: QueryDto, res: Response) {
    const { langCode } = query;
    const lang = utils.getLang(langCode);

    const categories = await this.prisma.category.findMany({ where: { isDelete: false } });
    const convertData = categories.map((category) => ({
      ...utils.convertRecordsName<Category>(category, langCode),
    }));
    const exportData = convertData.map((category) => ({
      name: category.name,
      status: getRecordStatus(category.status, langCode),
    }));
    const columns: WorkSheetColumns = [
      { header: lang.excel.header.name, key: 'name' },
      { header: lang.excel.header.status, key: 'status' },
    ];

    const { workBook } = this.excelService.generateExcel(exportData, columns, 'Categores');
    const buffer = await workBook.xlsx.writeBuffer();
    res.setHeader('Content-Type', this.resHeaderContentTypeValue);
    res.setHeader('Content-Disposition', this.resHeaderContentDispositionValue + 'categories.xlsx');
    res.send(buffer);
  }

  async subCategoryExport(query: QueryDto, res: Response) {
    const { langCode } = query;
    const lang = utils.getLang(langCode);

    const subCategories = await this.prisma.subCategory.findMany({
      where: { isDelete: false },
      include: { category: true },
    });
    const convertData = subCategories.map((subCategory) => ({
      ...utils.convertRecordsName<SubCategory>(subCategory, langCode),
      category:
        'category' in subCategory
          ? { ...utils.convertRecordsName<Category>(subCategory.category as Category, langCode) }
          : null,
    }));
    const exportData = convertData.map((subCategory) => ({
      name: subCategory.name,
      status: getRecordStatus(subCategory.status, langCode),
      category: subCategory.category ? subCategory.category.name : lang.excel.others.none,
    }));
    const columns: WorkSheetColumns = [
      { header: lang.excel.header.name, key: 'name' },
      { header: lang.excel.header.status, key: 'status' },
      { header: lang.excel.header.category, key: 'category' },
    ];

    const { workBook } = this.excelService.generateExcel(exportData, columns, 'Categores');
    const buffer = await workBook.xlsx.writeBuffer();
    res.setHeader('Content-Type', this.resHeaderContentTypeValue);
    res.setHeader('Content-Disposition', this.resHeaderContentDispositionValue + 'categories.xlsx');
    res.send(buffer);
  }

  async productExport(query: QueryDto, res: Response) {
    const { langCode } = query;
    const lang = utils.getLang(langCode);

    const products = await this.prisma.product.findMany({
      where: { isDelete: { equals: false } },
      include: { category: true, subCategory: true },
    });
    const convertData = products.map((product) => ({
      ...utils.convertRecordsName<Product>(product, langCode),
      category:
        'category' in product
          ? { ...utils.convertRecordsName<Category>(product.category as Category, langCode) }
          : null,
      subCategory:
        'subCategory' in product
          ? { ...utils.convertRecordsName<SubCategory>(product.subCategory as SubCategory, langCode) }
          : null,
    }));
    const exportData = convertData.map((product) => ({
      ...product,
      status: getRecordStatus(product.status, langCode),
      inventoryStatus: getInventoryStatus(product.inventoryStatus, langCode),
      unit: getProductUnit(product.unit, langCode),
      origin: getProductOrigin(product.origin, langCode),
      category: product.category ? product.category.name : lang.excel.others.none,
      subCategory: product.subCategory ? product.subCategory.name : lang.excel.others.none,
    }));
    const columns: WorkSheetColumns = [
      { header: lang.excel.header.productName, key: 'name' },
      { header: lang.excel.header.costPrice, key: 'costPrice' },
      { header: lang.excel.header.profit, key: 'profit' },
      { header: lang.excel.header.price, key: 'totalPrice' },
      { header: lang.excel.header.inventory, key: 'inventory' },
      { header: lang.excel.header.inventoryStatus, key: 'inventoryStatus' },
      { header: lang.excel.header.status, key: 'status' },
      { header: lang.excel.header.unit, key: 'unit' },
      { header: lang.excel.header.supplier, key: 'supplier' },
      { header: lang.excel.header.origin, key: 'origin' },
      { header: lang.excel.header.category, key: 'category' },
      { header: lang.excel.header.subCategory, key: 'subCategory' },
    ];

    const { workBook } = this.excelService.generateExcel(exportData, columns, 'Products');
    const buffer = await workBook.xlsx.writeBuffer();
    res.setHeader('Content-Type', this.resHeaderContentTypeValue);
    res.setHeader('Content-Disposition', this.resHeaderContentDispositionValue + 'products.xlsx');
    res.send(buffer);
  }

  async orderExport(query: QueryDto, res: Response) {
    const { langCode } = query;
    const lang = utils.getLang(langCode);

    const orders = await this.prisma.order.findMany({
      where: { isDelete: false },
      include: {
        items: true,
        user: { select: { fullName: true } },
        shipment: { select: { shipmentNumber: true } },
      },
    });
    const convertData = orders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({
        ...item,
        product:
          'product' in item
            ? { ...utils.convertRecordsName<Product>(item.product as Product, langCode) }
            : null,
      })),
    }));
    const exportData = convertData.map((order) => ({
      ...order,
      status: getOrderStatus(order.status, langCode),
      paymentMethod: getPaymentMethod(order.paymentMethod, langCode),
      paymentStatus: getPaymentStatus(order.paymentStatus, langCode),
      receivedType: getReceivedType(order.receivedType, langCode),
      user: order.user ? order.user.fullName : lang.excel.others.none,
      shipmentNumber: order.shipment ? order.shipment.shipmentNumber : lang.excel.others.none,
      totalProducts: getTotalProducts(order.items),
    }));
    const columns: WorkSheetColumns = [
      { header: lang.excel.header.orderNumber, key: 'orderNumber' },
      { header: lang.excel.header.userName, key: 'user' },
      { header: lang.excel.header.status, key: 'status' },
      { header: lang.excel.header.paymentMethod, key: 'paymentMethod' },
      { header: lang.excel.header.paymentStatus, key: 'paymentStatus' },
      { header: lang.excel.header.receivedType, key: 'receivedType' },
      { header: lang.excel.header.shipmentFee, key: 'shipmentFee' },
      { header: lang.excel.header.shipmentNumber, key: 'shipmentNumber' },
      { header: lang.excel.header.totalPayment, key: 'totalPayment' },
      { header: lang.excel.header.products, key: 'totalProducts' },
    ];

    const { workBook } = this.excelService.generateExcel(exportData, columns, 'Orders');
    const buffer = await workBook.xlsx.writeBuffer();
    res.setHeader('Content-Type', this.resHeaderContentTypeValue);
    res.setHeader('Content-Disposition', this.resHeaderContentDispositionValue + 'orders.xlsx');
    res.send(buffer);
  }

  async shipmentExport(query: QueryDto, res: Response) {
    const { langCode } = query;
    const lang = utils.getLang(langCode);

    const shipments = await this.prisma.shipment.findMany({
      where: { isDelete: { equals: false } },
      include: { order: { select: { orderNumber: true } } },
    });
    const exportData = shipments.map((shipment) => ({
      ...shipment,
      orderNumber: shipment.order ? shipment.order.orderNumber : lang.excel.others.none,
    }));
    const columns: WorkSheetColumns = [
      { header: lang.excel.header.shipmentNumber, key: 'shipmentNumber' },
      { header: lang.excel.header.userName, key: 'fullName' },
      { header: lang.excel.header.phone, key: 'phone' },
      { header: lang.excel.header.email, key: 'email' },
      { header: lang.excel.header.address, key: 'address' },
      { header: lang.excel.header.orderNumber, key: 'orderNumber' },
    ];

    const { workBook } = this.excelService.generateExcel(exportData, columns, 'Shipments');
    const buffer = await workBook.xlsx.writeBuffer();
    res.setHeader('Content-Type', this.resHeaderContentTypeValue);
    res.setHeader('Content-Disposition', this.resHeaderContentDispositionValue + 'shipments.xlsx');
    res.send(buffer);
  }
}
