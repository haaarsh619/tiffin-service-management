import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from 'src/entities/order.entity';
import { User } from 'src/entities/user.entity';
import { Menu } from 'src/entities/menu.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Menu])],
  providers: [OrdersService],
  controllers: [OrdersController]
})
export class OrdersModule {}
