import { IsOptional, IsString, IsPositive } from 'class-validator';

export class FilterOrdersDto {
  @IsOptional()
  @IsString()
  customer?: string;

  @IsOptional()
  @IsPositive()
  amountMin?: number;

  @IsOptional()
  @IsPositive()
  amountMax?: number;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  dateFrom?: string;

  @IsOptional()
  @IsString()
  dateTo?: string;
}
