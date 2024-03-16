import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../../modules/auth/auth.type';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class JwtStategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('ACCESS_TOKEN_SECRET'),
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
