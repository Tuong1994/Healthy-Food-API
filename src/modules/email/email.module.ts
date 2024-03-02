import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { EmailHelper } from './email.helper';

@Module({
  controllers: [EmailController],
  providers: [EmailService, EmailHelper],
})
export class EmailModule {}
