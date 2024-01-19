import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Cart, CartItem } from '@prisma/client';
import { Paging } from 'src/common/type/base';
import { ELang } from 'src/common/enum/base';
import { CartDto } from './cart.dto';
import utils from 'src/utils';

type CartItems = Array<Omit<CartItem, 'createdAt' | 'updatedAt'>>;

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
    const { page, limit, langCode } = query;
    let collection: Paging<Cart> = utils.defaultCollection();
    const carts = await this.prisma.cart.findMany({
      where: { isDelete: { equals: false } },
      include: {
        items: { select: { ...this.getSelectFields(langCode) } },
      },
    });
    const convertCollection = carts.map((cart) => ({
      ...cart,
      items: cart.items.map((item) => ({
        ...item,
        product: { ...utils.convertRecordsName(item.product, langCode) },
      })),
    }));
    if (convertCollection && convertCollection.length > 0)
      collection = utils.paging<Cart>(convertCollection, page, limit);
    return collection;
  }

  async getCart(query: QueryDto) {
    const { customerId, langCode } = query;
    const cart = await this.prisma.cart.findUnique({
      where: { customerId, isDelete: { equals: false } },
      include: {
        items: {
          select: { ...this.getSelectFields(langCode) },
        },
      },
    });
    if (!cart) throw new HttpException('Id not match', HttpStatus.NOT_FOUND);
    return {
      ...cart,
      items: cart.items.map((item) => ({
        ...item,
        product: { ...utils.convertRecordsName(item.product, langCode) },
      })),
    };
  }

  async createCart(cart: CartDto) {
    const { customerId, items } = cart;

    const newCart = await this.prisma.cart.create({ data: { customerId, isDelete: false } });
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
          ...utils.convertRecordsName(item, ELang.EN),
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
          if (item.quantity === 0) await this.prisma.cartItem.delete({ where: { id: item.id } });
          else await this.prisma.cartItem.update({ where: { id: item.id }, data: { ...item } });
        } else await this.prisma.cartItem.create({ data: { ...item, cartId } });
      }),
    );
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
