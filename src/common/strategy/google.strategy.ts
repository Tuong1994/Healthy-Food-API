import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import envKeys from '../env';

const { GOOGLE_ID, GOOGLE_SECRET, GOOGLE_CALLBACK_URL } = envKeys;

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService) {
    super({
      clientID: config.get(GOOGLE_ID),
      clientSecret: config.get(GOOGLE_SECRET),
      callbackURL: config.get(GOOGLE_CALLBACK_URL), // Gọi về NestJS
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const user = {
      email: profile.emails[0].value,
      name: profile.displayName,
      picture: profile.photos[0].value,
      googleId: profile.id,
      accessToken,
    };
    done(null, user);
  }
}
