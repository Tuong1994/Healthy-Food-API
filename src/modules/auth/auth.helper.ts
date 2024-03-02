import { Injectable } from '@nestjs/common';
import { TokenPayload } from './auth.type';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthHelper {
  constructor(
    private config: ConfigService,
    private jwt: JwtService,
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

  async getAccessToken(payload: TokenPayload) {
    const expiresIn = '30m';

    const expirationTimeInSeconds = Date.now() + this.parseDurationToMilliseconds(expiresIn);

    const token = await this.jwt.signAsync(payload, {
      secret: this.config.get('ACCESS_TOKEN_SECRET'),
      expiresIn,
    });
    return { token, expirationTimeInSeconds };
  }

  async getRefreshToken(payload: TokenPayload) {
    const token = await this.jwt.signAsync(payload, {
      secret: this.config.get('REFRESH_TOKEN_SECRET'),
      expiresIn: '24h',
    });
    return token;
  }
}
