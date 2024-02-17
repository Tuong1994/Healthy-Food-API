import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Paging } from 'src/common/type/base';
import { Image } from '@prisma/client';
import utils from 'src/utils';

@Injectable()
export class UploadService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async getImages(query: QueryDto) {
    const { page, limit } = query;
    let collection: Paging<Image> = utils.defaultCollection();
    const images = await this.prisma.image.findMany({ where: { isDelete: { equals: false } } });
    if (images && images.length > 0) collection = utils.paging<Image>(images, page, limit);
    return collection;
  }

  async customerUpload(query: QueryDto, file: Express.Multer.File) {
    const { customerId } = query;
    if (!customerId) throw new HttpException('Customer ID is missing', HttpStatus.BAD_REQUEST);
    if (!file) throw new HttpException('File is not provided', HttpStatus.NOT_FOUND);

    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      select: { image: true },
    });

    const result = await this.cloudinary.upload(utils.getFileUrl(file));
    const image = utils.generateImage(result, { customerId });

    if (customer && customer.image) {
      await this.cloudinary.destroy(customer.image.publicId);
      await this.prisma.image.update({ where: { customerId }, data: image });
    } else {
      await this.prisma.image.create({ data: { ...image, isDelete: false } });
    }

    throw new HttpException('Uploaded success', HttpStatus.OK);
  }

  async productUpload(query: QueryDto, file: Express.Multer.File) {
    const { productId } = query;
    if (!productId) throw new HttpException('Product ID is missing', HttpStatus.BAD_REQUEST);
    if (!file) throw new HttpException('Files are not provided', HttpStatus.NOT_FOUND);

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { image: true },
    });

    const result = await this.cloudinary.upload(utils.getFileUrl(file));
    const image = utils.generateImage(result, { productId });

    if (product.image) {
      await this.cloudinary.destroy(image.publicId);
      await this.prisma.image.update({ where: { productId }, data: image });
    } else {
      await this.prisma.image.create({ data: { ...image, isDelete: false } });
    }

    throw new HttpException('Uploaded success', HttpStatus.OK);
  }

  async removeImages(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const images = await this.prisma.image.findMany({ where: { id: { in: listIds } } });
    if (images && images.length > 0) {
      await this.prisma.image.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
      throw new HttpException('Removed success', HttpStatus.OK);
    }
    throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
  }

  async removeImagesPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const images = await this.prisma.image.findMany({ where: { id: { in: listIds } } });
    if (images && images.length > 0) {
      await Promise.all(images.map((image) => this.cloudinary.destroy(image.publicId)));
      await this.prisma.image.deleteMany({ where: { id: { in: listIds } } });
      throw new HttpException('Removed success', HttpStatus.OK);
    }
    throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
  }

  async restoreImages() {
    await this.prisma.image.updateMany({ data: { isDelete: false } });
    throw new HttpException('Restored success', HttpStatus.OK);
  }
}
