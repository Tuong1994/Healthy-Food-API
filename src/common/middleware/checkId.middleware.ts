import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CheckIdMiddleware implements NestMiddleware {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly model: string,
    private readonly validateField?: string,
  ) {
    this.use = this.use.bind(this);
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const {
      ids,
      userId,
      categoryId,
      subCategoryId,
      productId,
      cartId,
      cartItemId,
      orderId,
      orderItemId,
      shipmentId,
      commentId,
      rateId,
      likeId,
      imageId,
      cityId,
      districtId,
      wardId,
    } = req.query;

    if (
      !ids &&
      !userId &&
      !categoryId &&
      !subCategoryId &&
      !productId &&
      !cartId &&
      !cartItemId &&
      !orderId &&
      !orderItemId &&
      !shipmentId &&
      !commentId &&
      !rateId &&
      !likeId &&
      !imageId &&
      !cityId &&
      !districtId &&
      !wardId
    ) {
      throw new HttpException('Id is not provided', HttpStatus.BAD_REQUEST);
    }

    if (ids) return next();

    const checkedField = this.validateField ? this.validateField : 'id';

    const record = await this.prisma[this.model].findUnique({
      where: {
        [checkedField]: String(
          userId ||
            categoryId ||
            subCategoryId ||
            productId ||
            cartId ||
            cartItemId ||
            orderId ||
            orderItemId ||
            shipmentId ||
            commentId ||
            rateId ||
            likeId ||
            imageId ||
            cityId ||
            districtId ||
            wardId,
        ),
        isDelete: { equals: false },
      },
    });

    if (!record) throw new HttpException('Id not match', HttpStatus.NOT_FOUND);
    next();
  }
}
