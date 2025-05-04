import { IsNumber, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateInvoiceDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}$/, { message: 'Month must be in YYYY-MM format' })
  month: string;

  @IsNumber()
  @IsNotEmpty()
  totalOrders: number;

  @IsNumber()
  @IsNotEmpty()
  totalPayments: number;
}