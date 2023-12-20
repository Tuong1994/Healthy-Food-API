import * as bcryptjs from 'bcryptjs';
import * as fs from 'fs';
import { Image } from '@prisma/client';
import { UploadApiResponse } from 'cloudinary';

type ImageOption = {
  customerId?: string;
  productId?: string;
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
    const data = records.slice(start, end);

    return { totalItems, page, limit, data };
  },

  defaultCollection: () => {
    return { totalItems: 0, page: 0, limit: 0, data: [] };
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
    const b64 = Buffer.from(file.buffer).toString("base64");
    let dataURL = "data:" + file.mimetype + ";base64," + b64;
    return dataURL
  },

  removeFile: (path: string, message = 'Filed is deleted') => {
    if (!path) return;
    return fs.unlink(path, (error) => {
      if (error) throw error;
      console.log(message);
    });
  },
};

export default utils;
