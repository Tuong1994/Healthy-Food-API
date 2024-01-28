import * as bcryptjs from 'bcryptjs';
import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { TokenPayload } from './auth.type';
import { AuthDto, AuthPasswordDto } from './auth.dto';
import { ERole } from 'src/common/enum/base';
import { QueryDto } from 'src/common/dto/query.dto';
import utils from 'src/utils';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  private parseDurationToMilliseconds(duration: string) {
    const match = duration.match(/^(\d+)([hm])$/);

    if (!match) throw new Error('Invalid duration format');

    const value = parseInt(match[1], 10);
    const unit = match[2];

    if (unit === 'm') return value * 60 * 1000; // Convert minutes to milliseconds
    if (unit === 'h') return value * 60 * 60 * 1000; // Convert hours to milliseconds

    throw new Error('Invalid duration unit');
  }

  private async getAccessToken(payload: TokenPayload) {
    const expiresIn = '30m';

    const expirationTimeInSeconds = Date.now() + this.parseDurationToMilliseconds(expiresIn);

    const token = await this.jwt.signAsync(payload, {
      secret: this.config.get('ACCESS_TOKEN_SECRET'),
      expiresIn,
    });
    return { token, expirationTimeInSeconds };
  }

  private async getRefreshToken(payload: TokenPayload) {
    const token = await this.jwt.signAsync(payload, {
      secret: this.config.get('REFRESH_TOKEN_SECRET'),
      expiresIn: '24h',
    });
    return token;
  }

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
    const accessToken = await this.getAccessToken(payload);
    const refreshToken = await this.getRefreshToken(payload);
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
    try {
      const auth = await this.prisma.auth.findUnique({ where: { customerId } });
      if (!auth) throw new ForbiddenException('Token not found');
      const decode = this.jwt.verify(auth.token, {
        secret: this.config.get('REFRESH_TOKEN_SECRET'),
      });
      if (decode) {
        const payload: TokenPayload = {
          id: decode.id,
          email: decode.email,
          role: decode.role,
        };
        const { token, expirationTimeInSeconds } = await this.getAccessToken(payload);
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
    if (!auth) throw new ForbiddenException('Logout failed');

    await this.prisma.auth.delete({ where: { id: auth.id } });
    throw new HttpException('Logout success', HttpStatus.OK);
  }
}
