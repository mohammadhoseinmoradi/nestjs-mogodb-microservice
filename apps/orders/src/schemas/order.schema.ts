import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';

class Item {
  @Prop({ required: true })
  sku: string;

  @Prop({ required: true })
  qt: number;
}

@Schema({ versionKey: false })
export class Order extends AbstractDocument {
  @Prop()
  customer: string;

  @Prop()
  amount: number;

  @Prop()
  reference: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: [{ sku: { type: String }, qt: { type: Number } }] })
  items: Item[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
