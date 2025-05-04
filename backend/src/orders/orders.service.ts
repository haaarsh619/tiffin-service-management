import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { User } from '../entities/user.entity';
import { Menu } from '../entities/menu.entity';
import { Payment } from '../entities/payment.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, menuId, date } = createOrderDto;
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const menu = await this.menuRepository.findOneBy({ id: menuId });
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${menuId} not found`);
    }
    const order = this.orderRepository.create({
      user,
      menu,
      date,
      price: menu.price,
    });
    const savedOrder = await this.orderRepository.save(order);

    // Auto-create/update Payment for the month
    const month = date.slice(0, 7); // e.g., 2025-05
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.user = :userId', { userId })
      .andWhere('order.date LIKE :month', { month: `${month}%` })
      .getMany();

    const totalAmount = orders.reduce((sum, order) => sum + order.price, 0);

    let payment = await this.paymentRepository.findOneBy({
      user: { id: userId },
      month,
    });

    if (!payment) {
      payment = this.paymentRepository.create({
        user,
        month,
        amount: totalAmount,
        paidAmount: 0,
        status: 'unpaid',
      });
    } else {
      payment.amount = totalAmount;
      payment.status = payment.paidAmount >= totalAmount ? 'paid' : 'unpaid';
    }
    await this.paymentRepository.save(payment);

    return savedOrder;
  }

  async findAll(userId?: number): Promise<Order[]> {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.menu', 'menu');
    if (userId) {
      query.where('order.user = :userId', { userId });
    }
    return query.getMany();
  }
}