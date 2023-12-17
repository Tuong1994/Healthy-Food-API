import multer, { diskStorage } from 'multer';
import { HttpException, HttpStatus } from '@nestjs/common';

const ACCEPT_FILE_TYPE = ['image/png', 'image/jpg', 'image/jpeg'];
const FILE_SIZE = 1024 * 1024 * 2;

export const multerOption = (destination: string): multer.Options => {
  return {
    limits: { fileSize: FILE_SIZE, files: 5 },
    fileFilter(req, file, callback) {
      if (file && ACCEPT_FILE_TYPE.includes(file.mimetype)) return callback(null, true);
      callback(null, false);
      return callback(
        new HttpException(
          `Only accept file type ${ACCEPT_FILE_TYPE.join(',').replace('image/', '')}`,
          HttpStatus.BAD_REQUEST,
        ),
      );
    },
    storage: diskStorage({
      destination(req, file, callback) {
        callback(null, destination);
      },
      filename(req, file, callback) {
        callback(null, `${Date.now()}_${file.originalname}`);
      },
    }),
  };
};
