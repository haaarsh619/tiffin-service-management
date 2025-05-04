import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from 'src/entities/invoice.entity';
import { User } from 'src/entities/user.entity';
import { Order } from 'src/entities/order.entity';
import { Payment } from 'src/entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, User, Order, Payment])],
  providers: [InvoicesService],
  controllers: [InvoicesController]
})
export class InvoicesModule {}
