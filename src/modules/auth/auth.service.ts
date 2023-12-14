import * as bcryptjs from 'bcryptjs';
import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { TokenPayload } from './auth.type';
import { AuthDto } from './auth.dto';
import { ERole } from 'src/common/enum/base';
import { QueryDto } from 'src/common/dto/query.dto';
import utils from 'src/utils';

const EXPIRED_TIME = 1800000;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  private getAccessToken(payload: TokenPayload) {
    const token = this.jwt.signAsync(payload, {
      secret: this.config.get('ACCESS_TOKEN_SECRET'),
      expiresIn: '30m',
    });
    return token;
  }

  private getRefreshToken(payload: TokenPayload) {
    const token = this.jwt.signAsync(payload, {
      secret: this.config.get('REFRESH_TOKEN_SECRET'),
      expiresIn: '24h',
    });
    return token;
  }

  async signUp(auth: AuthDto) {
    const { account, password, phone, email } = auth;

    const exist = await this.prisma.customer.findUnique({ where: { account } });
    if (exist) throw new ForbiddenException('Account is already exist');

    const hashPass = utils.bcryptHash(password);
    const newAccount = await this.prisma.customer.create({
      data: { account, password: hashPass, phone, email, role: ERole.CUSTOMER },
    });
    return newAccount;
  }

  async signIn(auth: AuthDto) {
    const { account, password } = auth;

    const login = await this.prisma.customer.findUnique({ where: { account } });
    if (!login) throw new ForbiddenException('Account is not correct');

    const isAuth = bcryptjs.compareSync(password, login.password);
    if (!isAuth) throw new ForbiddenException('Password is not correct');

    const info = { ...login };
    delete info.password;
    delete info.createdAt;
    delete info.updatedAt;
    const payload: TokenPayload = {
      id: login.id,
      account: login.account,
      role: login.role,
    };
    const accessToken = await this.getAccessToken(payload);
    const refreshToken = await this.getRefreshToken(payload);
    await this.prisma.auth.create({ data: { token: refreshToken, customerId: login.id } });
    return { accessToken, info, expired: EXPIRED_TIME, isAuth: true };
  }

  async refresh(query: QueryDto) {
    const { customerId } = query;
    try {
      const auth = await this.prisma.auth.findUnique({ where: { customerId } });
      if (!auth) throw new ForbiddenException('Token not found');
      const decode = this.jwt.verify(auth.token, {
        secret: this.config.get('REFRESH_TOKEN_SECRET'),
      });
      if (decode) {
        const payload: TokenPayload = {
          id: decode.id,
          account: decode.account,
          role: decode.role,
        };
        const accessToken = await this.getAccessToken(payload);
        return { accessToken, expired: EXPIRED_TIME };
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) throw new ForbiddenException('Token is expired');
    }
  }

  async logout(query: QueryDto) {
    const { customerId } = query;

    const auth = await this.prisma.auth.findUnique({ where: { customerId } });
    if (!auth) throw new ForbiddenException('Logout failed');

    await this.prisma.auth.delete({ where: { id: auth.id } });
    throw new HttpException('Logout success', HttpStatus.OK);
  }
}
