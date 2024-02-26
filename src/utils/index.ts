import * as bcryptjs from 'bcryptjs';
import * as fs from 'fs';
import { Image } from '@prisma/client';
import { UploadApiResponse } from 'cloudinary';
import { ELang } from '../common/enum/base';
import { Lang, en, vn } from 'src/modules/export/lang';

type ImageOption = {
  customerId?: string;
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

  convertAddress: <M>(record: M, langCode: ELang) => {
    if (!record) return null;
    const recordClone = { ...record };
    delete record['addressEn'];
    delete record['addressVn'];
    delete record['fullAddressEn'];
    delete record['fullAddressVn'];
    const data = {
      address: langCode === ELang.EN ? recordClone['addressEn'] : recordClone['addressVn'],
      fullAddress: langCode === ELang.EN ? recordClone['fullAddressEn'] : recordClone['fullAddressVn'],
      ...record,
    };
    return data;
  },

  parseJSON: <M>(json: string): M => {
    if (!json) return;
    const parse = JSON.parse(json);
    return parse;
  },

  getLang: (langCode: ELang): Lang => {
    if (langCode === ELang.EN) return en;
    return vn;
  },
};

export default utils;
