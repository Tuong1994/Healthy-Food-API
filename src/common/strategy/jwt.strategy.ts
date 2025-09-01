import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { TokenPayload } from '../../modules/auth/auth.type';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Request } from 'express';
import envKeys from '../env';

const { ACCESS_TOKEN } = envKeys;

const extractJwtFromCookie = (req: Request) => {
  let token = null;
  if (req && req.cookies && req.cookies.tokenPayload) token = req.cookies.tokenPayload.token;
  return token;
};

@Injectable()
export class JwtStategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: extractJwtFromCookie,
      secretOrKey: config.get(ACCESS_TOKEN),
    });
  }

  async validate(payload: TokenPayload) {
    const account = await this.prisma.user.findUnique({
      where: { id: payload.id },
      include: { permission: true },
    });
    if (account) return account;
    return null;
  }
}
