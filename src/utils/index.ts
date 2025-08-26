import * as bcryptjs from 'bcryptjs';
import * as fs from 'fs';
import { Image, Prisma } from '@prisma/client';
import { UploadApiResponse } from 'cloudinary';
import { ELang, ESort } from '../common/enum/base';
import { Lang, en, vn } from '../common/lang';

type ImageOption = {
  userId?: string;
  productId?: string;
  categoryId?: string;
  subCategoryId?: string;
};

const utils = {
  bcryptHash: (secret: string) => {
    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(secret, salt);
    return hash;
  },

  paging: <M>(records: M[], pageParam: string, limitParam: string) => {
    const page = Number(pageParam);
    const limit = Number(limitParam);
    const totalItems = records.length;

    const start = (page - 1) * limit;
    const end = start + limit;
    const items = records.slice(start, end);

    return { totalItems, page, limit, items };
  },

  defaultCollection: () => {
    return { totalItems: 0, page: 0, limit: 0, items: [] };
  },

  defaultList: () => {
    return { totalItems: 0, items: [] };
  },

  generateImage: (result: UploadApiResponse, option?: ImageOption) => {
    const defaultImage: Pick<Image, 'path' | 'size' | 'publicId'> = {
      path: '',
      size: 0,
      publicId: '',
    };
    return {
      ...defaultImage,
      ...option,
      path: result.secure_url,
      size: result.bytes,
      publicId: result.public_id,
    };
  },

  getFileUrl: (file: Express.Multer.File) => {
    const b64 = Buffer.from(file.buffer).toString('base64');
    let dataURL = 'data:' + file.mimetype + ';base64,' + b64;
    return dataURL;
  },

  getSortBy: (sort: number): Prisma.SortOrder => {
    const sorts: Record<number, string> = {
      [ESort.NEWEST]: 'desc',
      [ESort.OLDEST]: 'asc',
      [ESort.PRICE_GO_UP]: 'asc',
      [ESort.PRICE_GO_DOWN]: 'desc',
    };
    return sorts[sort] as Prisma.SortOrder;
  },

  getLang: (langCode: ELang): Lang => {
    if (langCode === ELang.EN) return en;
    return vn;
  },

  removeFile: (path: string, message = 'Filed is deleted') => {
    if (!path) return;
    return fs.unlink(path, (error) => {
      if (error) throw error;
      console.log(message);
    });
  },

  convertRecordsName: <M>(record: M, langCode: ELang) => {
    if (!record) return null;
    const recordClone = { ...record };
    delete record['nameEn'];
    delete record['nameVn'];
    const data = { name: langCode === ELang.EN ? recordClone['nameEn'] : recordClone['nameVn'], ...record };
    return data;
  },

  parseJSON: <M>(json: string): M => {
    if (!json) return;
    const parse = JSON.parse(json);
    return parse;
  },

  formatPhoneNumber: (phone: string) => {
    let telFormat = '(xxx) xxxx xxxx';
    let mobileFormat = '(xxx) xxx xxxx';
    const telNumberLength = 11;
    const mobileNumberLength = 10;

    if (phone.length !== telNumberLength && phone.length !== mobileNumberLength)
      return 'Invalid phone number';

    for (let i = 0; i < phone.length; i++) {
      telFormat = telFormat.replace('x', phone[i]);
      mobileFormat = mobileFormat.replace('x', phone[i]);
    }

    if (phone.length === telNumberLength) return telFormat;
    return mobileFormat;
  },

  formatPrice: (locale: ELang, price = 0) => {
    const displayPrice = price.toLocaleString();
    const currency = locale === ELang.VN ? 'đ' : 'VND';
    return `${displayPrice} ${currency}`;
  },

  getTotalPayment: (totalPrice: number, shipmentFee: number) => {
    const paymentBeforeTax = totalPrice + shipmentFee;
    const taxFee = (paymentBeforeTax * 10) / 100;
    const totalPayment = paymentBeforeTax + taxFee;
    return { paymentBeforeTax, taxFee, totalPayment };
  },

  filterByKeywords: (value: string, keywords: string) => {
    return value.toLowerCase().includes(keywords.toLowerCase());
  },
};

export default utils;
