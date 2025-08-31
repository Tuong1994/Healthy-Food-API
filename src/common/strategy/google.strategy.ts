import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService) {
    super({
      clientID: config.get("GOOGLE_CLIENT_ID"),
      clientSecret: config.get("GOOGLE_CLIENT_SECRET"),
      callbackURL: 'http://localhost:3000/api/auth/google/callback', // Gọi về NestJS
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const user = {
      email: profile.emails[0].value,
      name: profile.displayName,
      picture: profile.photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
