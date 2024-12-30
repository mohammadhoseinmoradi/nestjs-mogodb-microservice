import { Controller, Get } from '@nestjs/common';
import { BillingService } from './billing.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Controller()
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly rmqService: RmqService,
  ) {}

  @Get()
  getHello(): string {
    return this.billingService.getHello();
  }

  @EventPattern('orderCreated')
  async handleOrderCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.billingService.bill(data);
    this.rmqService.ack(context);
  }

  @MessagePattern({
    exchange: 'my_exchange', // نام اکسچنج
    routingKey: 'my_routing_key', // کلید روتینگ
    queue: 'my_queue', // نام صف
  })
  async handleDailySalesReport(message: any) {
    console.log('Received daily sales report:', message);
    const emailContent = this.billingService.generateEmailContent(message);
    await this.billingService.sendEmail(emailContent);
  }
}
