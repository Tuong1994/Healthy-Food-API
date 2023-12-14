import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Cart, CartItem } from '@prisma/client';
import { Paging } from 'src/common/type/base';
import { CartDto } from './cart.dto';
import utils from 'src/utils';

type CartItems = Array<Omit<CartItem, 'createdAt' | 'updatedAt'>>;

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCarts(query: QueryDto) {
    const { page, limit } = query;
    let collection: Paging<Cart> = utils.defaultCollection();
    const carts = await this.prisma.cart.findMany({ include: { cartItems: true } });
    if (carts && carts.length > 0) collection = utils.paging<Cart>(carts, page, limit);
    return collection;
  }

  async getCart(query: QueryDto) {
    const { cartId } = query;
    const cart = await this.prisma.cart.findUnique({ where: { id: cartId }, include: { cartItems: true } });
    return cart;
  }

  async createCart(cart: CartDto) {
    const { customerId, items } = cart;

    const newCart = await this.prisma.cart.create({ data: { customerId } });
    if (newCart) {
      const cartItems: CartItems = items.map((item) => ({ ...item, cartId: newCart.id }));

      await this.prisma.cartItem.createMany({ data: cartItems });
      const resCart = await this.prisma.cart.findUnique({
        where: { id: newCart.id },
        include: {
          cartItems: {
            include: { product: true },
          },
        },
      });
      return resCart;
    }
  }

  async updateCart(cart: CartDto) {
    const { items } = cart;
    await this.prisma.cartItem.updateMany({ data: items });
    throw new HttpException('Updated success', HttpStatus.OK);
  }

  async removeCarts(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const carts = await this.prisma.cart.findMany({ where: { id: { in: listIds } } });
    if (carts && carts.length > 0) {
      await this.prisma.cart.deleteMany({ where: { id: { in: listIds } } });
      throw new HttpException('Removed success', HttpStatus.OK);
    }
    throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
  }
}
