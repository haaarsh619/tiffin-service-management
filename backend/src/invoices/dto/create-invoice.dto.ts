import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateInvoiceDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}$/, { message: 'Month must be in YYYY-MM format' })
  month: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  totalOrders: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  totalPayments: number;
}