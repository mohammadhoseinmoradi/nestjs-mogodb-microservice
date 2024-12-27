import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/common';
import { OrderRepository } from './order.repository';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema:Joi.object({
        MONGODB_URL : Joi.string().required(),
      }),
      envFilePath: './apps/orders/.env',

    }),

    DatabaseModule,
    MongooseModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService,OrderRepository],
})
export class OrdersModule {}
