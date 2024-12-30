import { Injectable } from '@nestjs/common';
import {
  Client,
  ClientProxy,
  RmqContext,
  RmqOptions,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class RmqService {
  @Client() private readonly client: ClientProxy;
  constructor(private readonly configService: ConfigService) {}
  getOptions(queue: string, noAck = false): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get<string>('RABBIT_MQ_URL')],
        queue: this.configService.get<string>(`RABBIT_MQ_${queue}_QUEUE`),
        noAck,
        persistent: true,
      },
    };
  }

  ack(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }

  async publish(pattern: string, message: any): Promise<void> {
    try {
      await this.client.emit(pattern, message).toPromise(); // استفاده از متد emit برای ارسال پیام
    } catch (error) {
      console.error('خطا در ارسال پیام به RabbitMQ:', error);
      throw new RpcException('خطا در ارسال پیام');
    }
  }

  async sendMessage(pattern: string, message: any) {
    return this.client.emit(pattern, message); // ارسال پیام به RabbitMQ
  }
}
