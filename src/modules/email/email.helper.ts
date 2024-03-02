import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailHelper {
  constructor(private config: ConfigService) {}

  getGmailTransporter() {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.config.get('APP_EMAIL'),
        pass: this.config.get('APP_EMAIL_PASS'),
      },
    });
    return transporter;
  }
}
