import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';

export class FilterOrdersDto {
  @IsOptional()
  @IsString()
  customer?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amountMin?: number;

  @IsOptional()
  @IsNumber()
  @Max(0)
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
