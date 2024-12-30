import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { RmqModule } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URL: Joi.string().required(),
        RABBIT_MQ_BILLING_QUEUE: Joi.string().required(),
      }),
    }),
    RmqModule,
  ],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {
  constructor(private configService: ConfigService) {
    // به این صورت می‌توانید مقدار MONGODB_URL را چاپ کنید
    const mongodbUrl = this.configService.get<string>('RABBIT_MQ_URL');
    console.log('MONGODB_URL: اینم ادرس توی فایل', mongodbUrl); // در کنسول چاپ می‌شود
  }
}
