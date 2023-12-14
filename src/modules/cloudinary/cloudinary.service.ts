import * as cloudinary from 'cloudinary';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });
  }

  async upload(filePath: string): Promise<cloudinary.UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload(filePath, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

  async destroy(fileId: string): Promise<cloudinary.DeleteApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader.destroy(fileId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}
