import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailHelper {
  constructor(private config: ConfigService) {}

  async sendGmail(options: nodemailer.SendMailOptions) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: this.config.get('APP_EMAIL'),
        pass: this.config.get('APP_EMAIL_PASS'),
      },
    });
    const emailOptions: nodemailer.SendMailOptions = {
      from: '"Healthy Food" <nbtuong1994@gmail.com>',
      ...options,
    };
    await transporter.sendMail(emailOptions);
  }
}
