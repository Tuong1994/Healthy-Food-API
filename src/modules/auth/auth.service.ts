import * as bcryptjs from 'bcryptjs';
import * as crypto from 'crypto';
import { ForbiddenException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { AuthChangePasswordDto, AuthDto, AuthForgotPasswordDto, AuthResetPasswordDto } from './auth.dto';
import { GooglePayload, TokenPayload } from './auth.type';
import { getEmailResetPasswordTemplate } from 'src/common/template/resetPassword';
import { AuthHelper } from './auth.helper';
import { ELang, ERole } from 'src/common/enum/base';
import { QueryDto } from 'src/common/dto/query.dto';
import { UserHelper } from '../user/user.helper';
import { EmailHelper } from '../email/email.helper';
import responseMessage from 'src/common/message';
import envKeys from 'src/common/env';
import utils from 'src/utils';

const {
  EMAIL_EXIST,
  EMAIL_NOT_MATCH,
  EMAIL_SENT,
  PASSWORD_NOT_MATCH,
  CONFIRM_PASSWORD_NOT_MATCH,
  CHANGE_PASSWORD_SUCCESS,
  RESET_PASSWORD_SUCCESS,
  NOT_AUTHORIZED,
  NOT_FOUND,
  NO_TOKEN,
  TOKEN_EXPIRED,
  RESET_TOKEN_EXPIRED,
  LOGOUT_SUCCESS,
} = responseMessage;

const { ACCESS_TOKEN, REFRESH_TOKEN, HOME_PAGE_URL } = envKeys;

const COOKIE_NAME = 'tokenPayload';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private authHelper: AuthHelper,
    private emailHelper: EmailHelper,
    private userHelper: UserHelper,
  ) {}

  async signUp(auth: AuthDto) {
    const { email, password, phone } = auth;
    const exist = await this.prisma.user.findUnique({ where: { email } });
    if (exist) throw new ForbiddenException(EMAIL_EXIST);
    const hashPass = utils.bcryptHash(password);
    const newAccount = await this.prisma.user.create({
      data: { email, password: hashPass, phone, isDelete: false, role: ERole.CUSTOMER },
    });
    return newAccount;
  }

  async signIn(res: Response, query: QueryDto, auth: AuthDto) {
    const { admin } = query;
    const { email, password } = auth;
    const login = await this.prisma.user.findUnique({
      where: { email },
      include: {
        image: { select: { id: true, path: true, size: true, publicId: true } },
        permission: admin ? { select: { id: true, create: true, update: true, remove: true } } : false,
      },
    });
    if (!login) throw new HttpException(EMAIL_NOT_MATCH, HttpStatus.NOT_FOUND);
    const isAuth = bcryptjs.compareSync(password, login.password);
    if (!isAuth) throw new ForbiddenException(PASSWORD_NOT_MATCH);
    if (admin && login.role === ERole.CUSTOMER) throw new UnauthorizedException(NOT_AUTHORIZED);
    const info = { ...login };
    delete info.password;
    delete info.createdAt;
    delete info.updatedAt;
    const payload = this.authHelper.getDecodePayload(login);
    const accessToken = await this.authHelper.getAccessToken(payload);
    const refreshToken = await this.authHelper.getRefreshToken(payload);
    await this.prisma.auth.upsert({
      where: { userId: login.id },
      create: { token: refreshToken, userId: login.id },
      update: { token: refreshToken },
    });
    res.cookie(COOKIE_NAME, accessToken, this.authHelper.getCookiesOptions());
    return res.json({
      expired: accessToken.expirationTimeInSeconds,
      isAuth: true,
      info,
    });
  }

  async googleSignIn() {}

  async googleCallback(req: Request, res: Response) {
    const userReq = req.user as GooglePayload;
    if (!userReq) throw new ForbiddenException(EMAIL_NOT_MATCH);
    const { email, name, googleId } = userReq;
    const user = await this.prisma.user.findUnique({ where: { email }, select: { id: true, email: true, role: true } });
    let tokenPayload: TokenPayload;
    if (!user) {
      const newUser = await this.prisma.user.create({
        data: { fullName: name, email, googleId, password: '', phone: '', role: ERole.CUSTOMER },
      });
      tokenPayload = { id: newUser.id, email: newUser.email, role: newUser.role };
    } else {
      await this.prisma.user.update({ where: { email }, data: { googleId } });
      tokenPayload = { id: user.id, email: user.email, role: user.role };
    }
    const accessToken = await this.authHelper.getAccessToken(tokenPayload);
    const refreshToken = await this.authHelper.getRefreshToken(tokenPayload);
    await this.prisma.auth.upsert({
      where: { userId: tokenPayload.id },
      create: { token: refreshToken, userId: tokenPayload.id },
      update: { token: refreshToken },
    });
    res.cookie(COOKIE_NAME, accessToken, this.authHelper.getCookiesOptions());
    return res.redirect(this.config.get(HOME_PAGE_URL));
  }

  async getOAuthInfo(req: Request, res: Response) {
    if (!req.cookies.tokenPayload) throw new ForbiddenException(NO_TOKEN);
    const { token: accessToken } = req.cookies.tokenPayload;
    if (!accessToken) throw new ForbiddenException(NO_TOKEN);
    const decode = this.jwt.verify(accessToken, { secret: this.config.get(ACCESS_TOKEN) }) as TokenPayload;
    const info = await this.prisma.user.findUnique({
      where: { email: decode.email },
      select: { ...this.userHelper.getSelectFields() },
    });
    return res.json({
      expired: accessToken.expirationTimeInSeconds,
      isAuth: true,
      info,
    });
  }

  async refresh(req: Request) {
    if (!req.cookies.tokenPayload) throw new ForbiddenException(NO_TOKEN);
    const { token: accessToken } = req.cookies.tokenPayload;
    if (!accessToken) throw new ForbiddenException(NO_TOKEN);
    const decode = this.jwt.verify(accessToken, { secret: this.config.get(ACCESS_TOKEN) }) as TokenPayload;
    const auth = await this.prisma.auth.findUnique({ where: { userId: decode.id } });
    if (!auth) throw new ForbiddenException(NO_TOKEN);
    try {
      const decode = this.jwt.verify(auth.token, { secret: this.config.get(REFRESH_TOKEN) });
      if (decode) {
        const payload = this.authHelper.getDecodePayload(decode);
        const { expirationTimeInSeconds } = await this.authHelper.getAccessToken(payload);
        return { expired: expirationTimeInSeconds };
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) throw new ForbiddenException(TOKEN_EXPIRED);
    }
  }

  async authenticate(req: Request) {
    if (!req.cookies.tokenPayload) throw new ForbiddenException(NO_TOKEN);
    const { token: loginToken } = req.cookies.tokenPayload;
    if (!loginToken) throw new ForbiddenException(NO_TOKEN);
    const decode = this.jwt.decode(loginToken) as TokenPayload;
    const info = await this.prisma.user.findUnique({
      where: { id: decode.id },
      include: {
        image: { select: { id: true, path: true, size: true, publicId: true } },
        permission: { select: { id: true, create: true, update: true, remove: true } },
      },
    });
    delete info.password;
    delete info.createdAt;
    delete info.updatedAt;
    const payload = this.authHelper.getDecodePayload(info);
    const accessToken = await this.authHelper.getAccessToken(payload);
    try {
      this.jwt.verify(loginToken, { secret: this.config.get(ACCESS_TOKEN) }) as TokenPayload;
      return {
        accessToken: accessToken.token,
        expired: accessToken.expirationTimeInSeconds,
        isAuth: true,
        info,
      };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        try {
          const response = await this.refresh(req);
          return {
            expired: response.expired,
            isAuth: true,
            info,
          };
        } catch (error) {
          if (error instanceof TokenExpiredError) throw new ForbiddenException(TOKEN_EXPIRED);
        }
      }
    }
  }

  async changePassword(query: QueryDto, password: AuthChangePasswordDto) {
    const { userId } = query;
    const { oldPassword, newPassword } = password;
    const customer = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!customer) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    const isAuth = bcryptjs.compareSync(oldPassword, customer.password);
    if (!isAuth) throw new ForbiddenException(CONFIRM_PASSWORD_NOT_MATCH);
    const hash = utils.bcryptHash(newPassword);
    await this.prisma.user.update({ where: { id: userId }, data: { password: hash } });
    throw new HttpException(CHANGE_PASSWORD_SUCCESS, HttpStatus.OK);
  }

  async forgotPassword(query: QueryDto, data: AuthForgotPasswordDto) {
    const { langCode, admin } = query;
    const { email } = data;
    const auth = await this.prisma.user.findUnique({ where: { email } });
    if (!auth) throw new ForbiddenException(EMAIL_NOT_MATCH);
    const { token, tokenHash, expires } = this.authHelper.getPasswordResetToken();
    await this.prisma.user.update({
      where: { email },
      data: { resetToken: tokenHash, resetTokenExpires: expires },
    });
    const devUrl = admin ? 'http://localhost:5173' : 'http://localhost:3000';
    const prodUrl = admin ? 'https://healthy-food-admin.vercel.app' : 'https://healthy-food-main.vercel.app';
    const resetUrl = `${prodUrl}/auth/resetPassword/${token}?langCode=${langCode}`;
    const subject = langCode === ELang.EN ? 'Reset password' : 'Đặt lại mật khẩu';
    try {
      await this.emailHelper.sendGmail({
        to: email,
        subject,
        html: getEmailResetPasswordTemplate(langCode, auth.fullName, resetUrl),
      });
      throw new HttpException(EMAIL_SENT, HttpStatus.OK);
    } catch (error) {
      if (error && error.status > 200) {
        await this.prisma.user.update({
          where: { email },
          data: { resetToken: null, resetTokenExpires: null },
        });
      }
    }
  }

  async resetPassword(data: AuthResetPasswordDto) {
    const { resetPassword, token } = data;
    const resetToken = crypto.createHash('sha256').update(token).digest('hex');
    const auth = await this.prisma.user.findFirst({
      where: { resetToken, resetTokenExpires: { gt: Date.now() } },
    });
    if (!auth) throw new HttpException(RESET_TOKEN_EXPIRED, HttpStatus.BAD_REQUEST);
    await this.prisma.user.update({
      where: { id: auth.id },
      data: { password: utils.bcryptHash(resetPassword), resetToken: null, resetTokenExpires: null },
    });
    throw new HttpException(RESET_PASSWORD_SUCCESS, HttpStatus.OK);
  }

  async logout(res: Response, query: QueryDto) {
    const { userId } = query;
    const auth = await this.prisma.auth.findUnique({ where: { userId } });
    if (!auth) throw new HttpException(LOGOUT_SUCCESS, HttpStatus.OK);
    await this.prisma.auth.delete({ where: { id: auth.id } });
    res.cookie(COOKIE_NAME, '', { maxAge: 0, httpOnly: true });
    throw new HttpException(LOGOUT_SUCCESS, HttpStatus.OK);
  }

  async example(query: QueryDto) {
    const { userId } = query;
    await this.prisma.user.update({
      where: { id: userId },
      data: { resetToken: null, resetTokenExpires: null },
    });
    throw new HttpException('Update success', HttpStatus.OK);
  }
}
