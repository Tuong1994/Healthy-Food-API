import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EmailContactDto, EmailOrderDto } from './email.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { EmailHelper } from './email.helper';
import { getEmailContactTemplate } from './template/contact';
import { ELang } from 'src/common/enum/base';
import { getEmailOrderTemplate } from './template/order';

@Injectable()
export class EmailService {
  constructor(private emailHelper: EmailHelper) {}

  async emailContact(query: QueryDto, contact: EmailContactDto) {
    const { langCode } = query;
    const { email } = contact;

    const subject = langCode === ELang.EN ? 'Contact information' : 'Thông tin liên hệ';
    const gmailTransporter = this.emailHelper.getGmailTransporter();
    await gmailTransporter.sendMail({
      from: '"Healthy Food" <nbtuong1994@gmail.com>',
      to: email,
      subject,
      html: getEmailContactTemplate(langCode, contact),
    });
    throw new HttpException('Email has been sent', HttpStatus.OK);
  }

  async emailOrder(query: QueryDto, data: EmailOrderDto) {
    const { langCode } = query;
    const { email } = data;

    const subject = langCode === ELang.EN ? 'Order information' : 'Thông tin đơn hàng';
    const gmailTransporter = this.emailHelper.getGmailTransporter();
    await gmailTransporter.sendMail({
      from: '"Healthy Food" <nbtuong1994@gmail.com>',
      to: email,
      subject,
      html: await getEmailOrderTemplate(langCode, data),
    });
    throw new HttpException('Email has been sent', HttpStatus.OK);
  }
}
