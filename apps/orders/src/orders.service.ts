/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreateOrderRequest } from './dto/create-order.request';
import { ConfigService } from '@nestjs/config';
import { BILLING_SERVICE } from './constants/service';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
 constructor(private readonly orderRepository:OrdersRepository,    private configService: ConfigService , @Inject(BILLING_SERVICE) private billingClient:ClientProxy) {}
  async createOrder(request: CreateOrderRequest) {
    const session = await this.orderRepository.startTransaction();
    try {
      const order = await this.orderRepository.create(request,{session});

      await lastValueFrom(this.billingClient.emit('orderCreated',{request}));

      await session.commitTransaction();

      return order;

    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
  }

  async getOrders(){
    return this.orderRepository.find({});
  }
}
