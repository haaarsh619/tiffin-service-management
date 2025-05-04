import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { User } from '../entities/user.entity';
import { Menu } from '../entities/menu.entity';
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
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, menuId } = createOrderDto;
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const menu = await this.menuRepository.findOneBy({ id: menuId });
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${menuId} not found`);
    }
    const order = this.orderRepository.create({
      ...createOrderDto,
      user,
      menu,
    });
    return this.orderRepository.save(order);
  }

  async findAll(userId?: number, date?: string): Promise<Order[]> {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.menu', 'menu');
    if (userId) {
      query.where('order.user = :userId', { userId });
    }
    if (date) {
      query.andWhere('order.date = :date', { date });
    }
    return query.getMany();
  }
}