import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Cart, CartItem } from '@prisma/client';
import { Paging } from 'src/common/type/base';
import { ELang } from 'src/common/enum/base';
import { CartDto } from './cart.dto';
import utils from 'src/utils';
import { CartItems } from './cart.type';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  private getSelectFields(langCode: ELang) {
    return {
      id: true,
      quantity: true,
      productId: true,
      product: {
        select: {
          id: true,
          nameEn: langCode === ELang.EN,
          nameVn: langCode === ELang.VN,
          image: true,
          totalPrice: true,
        },
      },
    };
  }

  async getCarts(query: QueryDto) {
    const { page, limit, langCode, sortBy } = query;
    let collection: Paging<Cart> = utils.defaultCollection();
    const carts = await this.prisma.cart.findMany({
      where: { isDelete: { equals: false } },
      include: { items: { select: { ...this.getSelectFields(langCode) } } },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
    });
    const convertCarts = carts.map((cart) => ({
      ...cart,
      items: cart.items.map((item) => ({
        ...item,
        product: { ...utils.convertRecordsName(item.product, langCode) },
      })),
    }));
    if (convertCarts && convertCarts.length > 0) collection = utils.paging<Cart>(convertCarts, page, limit);
    return collection;
  }

  async getCart(query: QueryDto) {
    const { page, limit, userId, langCode } = query;
    const cart = await this.prisma.cart.findUnique({
      where: { userId, isDelete: { equals: false } },
      include: { items: { select: { ...this.getSelectFields(langCode) } } },
    });
    if (!cart) throw new HttpException('Id not match', HttpStatus.NOT_FOUND);
    const isPaging = Boolean(page) && Boolean(limit);
    const cartItems = cart.items.map((item) => ({
      ...item,
      product: { ...utils.convertRecordsName(item.product, langCode) },
    }));
    const collection = utils.paging(cartItems, page, limit);
    const responseCart = { ...cart, items: !isPaging ? cartItems : collection.items };
    return { totalItems: collection.totalItems, detail: responseCart };
  }

  async createCart(cart: CartDto) {
    const { userId, items } = cart;

    const newCart = await this.prisma.cart.create({ data: { userId, isDelete: false } });
    if (newCart) {
      const cartItems: CartItems = items.map((item) => ({ ...item, cartId: newCart.id, isDelete: false }));

      await this.prisma.cartItem.createMany({ data: cartItems });
      const responseCart = await this.prisma.cart.findUnique({
        where: { id: newCart.id },
        include: {
          items: {
            select: {
              quantity: true,
              product: {
                select: { id: true, nameEn: true, nameVn: true, image: true, totalPrice: true },
              },
            },
          },
        },
      });
      return {
        ...responseCart,
        items: responseCart.items.map((item) => ({
          ...item,
          product: { ...utils.convertRecordsName(item.product, ELang.EN) },
        })),
      };
    }
  }

  async updateCart(query: QueryDto, cart: CartDto) {
    const { cartId } = query;
    const { items } = cart;
    await Promise.all(
      items.map(async (item) => {
        if (item.id) {
          if (items.length === 1 && item.quantity === 0) {
            await this.prisma.cart.delete({ where: { id: cartId } });
          } else {
            if (item.quantity === 0) await this.prisma.cartItem.delete({ where: { id: item.id } });
            else await this.prisma.cartItem.update({ where: { id: item.id }, data: { ...item } });
          }
        } else await this.prisma.cartItem.create({ data: { ...item, cartId, isDelete: false } });
      }),
    );
    throw new HttpException('Updated success', HttpStatus.OK);
  }

  async removeCartItems(query: QueryDto) {
    const { cartId, ids } = query;
    const listIds = ids.split(',');
    const cartItems = await this.prisma.cartItem.findMany({ where: { id: { in: listIds } } });
    if (cartItems && !cartItems.length) throw new HttpException('Cart item not found', HttpStatus.NOT_FOUND);
    await this.prisma.cartItem.deleteMany({ where: { id: { in: listIds } } });
    const cart = await this.prisma.cart.findUnique({ where: { id: cartId }, select: { id: true, items: true } });
    if (cart && cart.items.length === 0) await this.prisma.cart.delete({ where: { id: cart.id } });
    throw new HttpException('Removed success', HttpStatus.OK);
  }

  async removeCarts(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const carts = await this.prisma.cart.findMany({ where: { id: { in: listIds } } });
    if (carts && !carts.length) throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
    await this.prisma.cart.deleteMany({ where: { id: { in: listIds } } });
    throw new HttpException('Removed success', HttpStatus.OK);
  }
}
