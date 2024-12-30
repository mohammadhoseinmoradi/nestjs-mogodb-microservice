import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

class ItemDto {
  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsNumber()
  qt: number;
}

export class CreateOrderRequest {
  @IsString()
  @IsNotEmpty()
  customer: string;

  @IsPositive()
  amount: number;

  @IsString()
  reference: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];
}
