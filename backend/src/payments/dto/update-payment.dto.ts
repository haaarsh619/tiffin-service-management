import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsOptional,
  Length,
  IsEnum,
  IsIn,
} from 'class-validator';

export class UpdatePaymentDto {
  @ApiProperty()
  @IsNumber()
  paidAmount: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(1, 50)
  paymentMethod?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsIn(['paid', 'unpaid'])
  status?: 'paid' | 'unpaid';
}
