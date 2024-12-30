import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import * as Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule, RmqModule } from '@app/common';
import { OrdersRepository } from './orders.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { BILLING_SERVICE } from './constants/service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/orders/.env',
      validationSchema: Joi.object({
        MONGODB_URL: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
    }),

    DatabaseModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    RmqModule.register({ name: BILLING_SERVICE }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule {
  constructor(private configService: ConfigService) {
    // به این صورت می‌توانید مقدار MONGODB_URL را چاپ کنید
    const mongodbUrl = this.configService.get<string>('RABBIT_MQ_URL');
    console.log('MONGODB_URL: اینم ادرس توی فایل', mongodbUrl); // در کنسول چاپ می‌شود
  }
}
