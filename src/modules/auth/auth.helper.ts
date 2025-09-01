import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { TokenPayload } from './auth.type';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions } from 'express';
import { User } from '@prisma/client';
import envKeys from 'src/common/env';

const { ACCESS_TOKEN, REFRESH_TOKEN } = envKeys;

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
      secret: this.config.get(ACCESS_TOKEN),
      expiresIn,
    });
    return { token, expirationTimeInSeconds };
  }

  async getRefreshToken(payload: TokenPayload) {
    const token = await this.jwt.signAsync(payload, {
      secret: this.config.get(REFRESH_TOKEN),
      expiresIn: '24h',
    });
    return token;
  }

  getPasswordResetToken() {
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expires = Date.now() + 10 * 60 * 1000;
    return { token, tokenHash, expires };
  }

  getCookiesOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    };
  }

  getDecodePayload(record: User): TokenPayload {
    return { id: record.id, email: record.email, role: record.role };
  }
}
