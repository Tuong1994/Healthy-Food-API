import multer, { memoryStorage } from 'multer';
import { HttpException, HttpStatus } from '@nestjs/common';

const ACCEPT_FILE_TYPE = ['image/png', 'image/jpg', 'image/jpeg'];
const FILE_SIZE = 1024 * 1024 * 2;

export const multerOption = (): multer.Options => {
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
    storage: memoryStorage(),
  };
};
