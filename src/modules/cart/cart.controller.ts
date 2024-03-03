import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { QueryPaging } from 'src/common/decorator/query.decorator';
import { QueryDto } from 'src/common/dto/query.dto';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { CartDto } from './cart.dto';

@Controller('api/cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  getCarts(@QueryPaging() query: QueryDto) {
    return this.cartService.getCarts(query);
  }

  @Get('detail')
  @HttpCode(HttpStatus.OK)
  getCart(@Query() query: QueryDto) {
    return this.cartService.getCart(query);
  }

  @Post('create')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  createCart(@Body() cart: CartDto) {
    return this.cartService.createCart(cart);
  }

  @Put('update')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  updateCart(@Query() query: QueryDto, @Body() cart: CartDto) {
    return this.cartService.updateCart(query, cart);
  }

  @Delete('removeItem')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  removeCartItems(@Query() query: QueryDto) {
    return this.cartService.removeCartItems(query);
  }

  @Delete('remove')
  // @UseGuards(JwtGuard)
  // @HttpCode(HttpStatus.OK)
  removeCart(@Query() query: QueryDto) {
    return this.cartService.removeCarts(query);
  }
}
