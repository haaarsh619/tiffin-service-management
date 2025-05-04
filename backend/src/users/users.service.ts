import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Order } from '../entities/order.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { contact } = createUserDto;
    const existingUser = await this.userRepository.findOneBy({ contact });

    if (existingUser) {
      throw new BadRequestException(
        `User with contact ${contact} already exists`,
      );
    }

    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async getOrdersByMonth(id: number): Promise<any> {
    const user = await this.findOne(id);
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.menu', 'menu')
      .where('order.user = :userId', { userId: id })
      .getMany();

    // Group orders by month (YYYY-MM)
    const groupedOrders = orders.reduce((acc, order) => {
      const month = order.date.slice(0, 7); // e.g., 2025-05
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push({
        id: order.id,
        date: order.date,
        menu: order.menu.name,
        price: order.price,
      });
      return acc;
    }, {});

    // Calculate total
    const total = orders.reduce((sum, order) => sum + order.price, 0);

    return { user, orders: groupedOrders, total };
  }
}
