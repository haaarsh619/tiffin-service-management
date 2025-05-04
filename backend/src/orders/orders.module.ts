import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from '../entities/order.entity';
import { User } from '../entities/user.entity';
import { Menu } from '../entities/menu.entity';
import { Payment } from '../entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Menu, Payment])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}