import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CheckIdMiddleware implements NestMiddleware {
  constructor(private readonly model: any) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const {
      ids,
      customerId,
      categoryId,
      subCategoryId,
      productId,
      cartId,
      cartItemId,
      orderId,
      orderItemId,
      commentId,
      rateId,
      imageId,
      cityId,
      districtId,
      wardId,
    } = req.query;

    if (
      !ids &&
      !customerId &&
      !categoryId &&
      !subCategoryId &&
      !productId &&
      !cartId &&
      !cartItemId &&
      !orderId &&
      !orderItemId &&
      !commentId &&
      !rateId &&
      !imageId &&
      !cityId &&
      !districtId &&
      !wardId
    ) {
      throw new HttpException('Id is not provided', HttpStatus.BAD_REQUEST);
    }

    if (ids) return next();

    const record = await this.model.findUnique({
      where: {
        id: String(
          customerId ||
            categoryId ||
            subCategoryId ||
            productId ||
            cartId ||
            cartItemId ||
            orderId ||
            orderItemId ||
            commentId ||
            rateId ||
            imageId ||
            cityId ||
            districtId ||
            wardId,
        ),
      },
    });

    if (!record) throw new HttpException('Id not match', HttpStatus.NOT_FOUND);
    next();
  }
}
