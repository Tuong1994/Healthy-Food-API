import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import utils from 'src/utils';

@Injectable()
export class UploadService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

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
    }

    await this.prisma.image.create({ data: image });

    throw new HttpException('Uploaded success', HttpStatus.OK);
  }

  async productUpload(query: QueryDto, files: Express.Multer.File[]) {
    const { productId } = query;
    if (!productId) throw new HttpException('Product ID is missing', HttpStatus.BAD_REQUEST);
    if (!files || !files.length) throw new HttpException('Files are not provided', HttpStatus.NOT_FOUND);

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { images: true },
    });

    const images = await Promise.all(
      files.map(async (file) => {
        const result = await this.cloudinary.upload(utils.getFileUrl(file));
        return utils.generateImage(result, { productId });
      }),
    );

    if (product.images && product.images.length > 5) {
      await Promise.all(product.images.map((image) => this.cloudinary.destroy(image.publicId)));
      await this.prisma.image.deleteMany({ where: { productId } });
    }

    await this.prisma.image.createMany({ data: images });

    throw new HttpException('Uploaded success', HttpStatus.OK);
  }

  async removeImages(query: QueryDto) {
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
}
