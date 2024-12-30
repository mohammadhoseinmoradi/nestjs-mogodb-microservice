import { Inject, Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreateOrderRequest } from './dto/create-order.request';
import { FilterOrdersDto } from './dto/filter_order_request';
import { BILLING_SERVICE } from './constants/service';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Order } from './schemas/order.schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RmqService } from '@app/common';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrdersRepository,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
    private readonly rmqService: RmqService,
  ) {}
  async createOrder(request: CreateOrderRequest) {
    const session = await this.orderRepository.startTransaction();
    try {
      const order = await this.orderRepository.create(request, { session });

      await lastValueFrom(this.billingClient.emit('orderCreated', { request }));

      await session.commitTransaction();

      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
  }

  async getOrderById(id: string) {
    return this.orderRepository.findOne({ _id: id });
  }

  async getOrders() {
    return this.orderRepository.find({});
  }

  async getFilterOrders(filterOrdersDto: FilterOrdersDto): Promise<Order[]> {
    const { customer, amountMin, amountMax, reference, dateFrom, dateTo } =
      filterOrdersDto;

    const query: any = {};

    if (customer) {
      query.customer = customer;
    }
    if (reference) {
      query.reference = reference;
    }
    if (amountMin || amountMax) {
      query.amount = {};
      if (amountMin) {
        query.amount.$gte = amountMin;
      }
      if (amountMax) {
        query.amount.$lte = amountMax;
      }
    }
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) {
        query.date.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query.date.$lte = new Date(dateTo);
      }
    }
    return this.orderRepository.find(query);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateDailyReport() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const salesData = await this.orderRepository.aggregate([
      { $match: { date: { $gte: today, $lt: tomorrow } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.sku',
          totalQuantity: { $sum: '$items.qt' },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    const report = {
      totalAmountSales: salesData.reduce(
        (sum, item) => sum + item.totalAmount,
        0,
      ),
      salesSummary: salesData.map((item) => ({
        sku: item.id,
        totalQuantity: item.totalQuantity,
      })),
    };

    await this.rmqService.sendMessage('daily_sales_report', report);
    return { message: 'گزارش روزانه ارسال شد' };
  }
}
