/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderRequest } from './dto/create-order.request';
import { FilterOrdersDto } from './dto/filter_order_request';

@Controller('invoices')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

 @Post()
 async createOrder(@Body() request: CreateOrderRequest){
  return this.ordersService.createOrder(request);
 }
 @Get()
 async getOrderByQueryFilter(@Query() filterOrdersDto:FilterOrdersDto){
  return this.ordersService.getFilterOrders(filterOrdersDto);
 }

 @Get()
 async getOrders(){
  return this.ordersService.getOrders();
 }

 @Get(':id')
 async getOrderById(@Param('id') id: string){
  return this.ordersService.getOrderById(id);
 }



}
