import * as bcryptjs from 'bcryptjs';
import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { TokenPayload } from './auth.type';
import { AuthDto, AuthPasswordDto } from './auth.dto';
import { AuthHelper } from './auth.helper';
import { ERole } from 'src/common/enum/base';
import { QueryDto } from 'src/common/dto/query.dto';
import utils from 'src/utils';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private authHelper: AuthHelper,
  ) {}

  async signUp(auth: AuthDto) {
    const { email, password, phone } = auth;

    const exist = await this.prisma.customer.findUnique({ where: { email } });
    if (exist) throw new ForbiddenException('Email is already exist');

    const hashPass = utils.bcryptHash(password);
    const newAccount = await this.prisma.customer.create({
      data: { email, password: hashPass, phone, isDelete: false, role: ERole.CUSTOMER },
    });
    return newAccount;
  }

  async signIn(auth: AuthDto) {
    const { email, password } = auth;

    const login = await this.prisma.customer.findUnique({
      where: { email },
      include: {
        image: { select: { id: true, path: true, size: true, publicId: true } },
      },
    });
    if (!login) throw new HttpException('Email is not correct', HttpStatus.NOT_FOUND);

    const isAuth = bcryptjs.compareSync(password, login.password);
    if (!isAuth) throw new ForbiddenException('Password is not correct');

    const info = { ...login };
    delete info.password;
    delete info.createdAt;
    delete info.updatedAt;
    const payload: TokenPayload = {
      id: login.id,
      email: login.email,
      role: login.role,
    };
    const accessToken = await this.authHelper.getAccessToken(payload);
    const refreshToken = await this.authHelper.getRefreshToken(payload);
    await this.prisma.auth.upsert({
      where: { customerId: login.id },
      create: { token: refreshToken, customerId: login.id },
      update: { token: refreshToken },
    });
    return {
      accessToken: accessToken.token,
      expired: accessToken.expirationTimeInSeconds,
      info,
      isAuth: true,
    };
  }

  async refresh(query: QueryDto) {
    const { customerId } = query;
    const auth = await this.prisma.auth.findUnique({ where: { customerId } });
    if (!auth) throw new ForbiddenException('Token not found');
    try {
      const decode = this.jwt.verify(auth.token, {
        secret: this.config.get('REFRESH_TOKEN_SECRET'),
      });
      if (decode) {
        const payload: TokenPayload = {
          id: decode.id,
          email: decode.email,
          role: decode.role,
        };
        const { token, expirationTimeInSeconds } = await this.authHelper.getAccessToken(payload);
        return { accessToken: token, expired: expirationTimeInSeconds };
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) throw new ForbiddenException('Token is expired');
    }
  }

  async changePassword(query: QueryDto, password: AuthPasswordDto) {
    const { customerId } = query;
    const { oldPassword, newPassword } = password;

    const customer = await this.prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
    const isAuth = bcryptjs.compareSync(oldPassword, customer.password);
    if (!isAuth) throw new ForbiddenException('Old password is not correct');

    const hash = utils.bcryptHash(newPassword);
    await this.prisma.customer.update({ where: { id: customerId }, data: { password: hash } });
    throw new HttpException('Password has successfully changed', HttpStatus.OK);
  }

  async logout(query: QueryDto) {
    const { customerId } = query;
    const auth = await this.prisma.auth.findUnique({ where: { customerId } });
    if (!auth) throw new HttpException('Logout success', HttpStatus.OK);
    await this.prisma.auth.delete({ where: { id: auth.id } });
    throw new HttpException('Logout success', HttpStatus.OK);
  }
}
