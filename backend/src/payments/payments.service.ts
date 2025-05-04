import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { User } from '../entities/user.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const { userId } = createPaymentDto;
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const payment = this.paymentRepository.create({
      ...createPaymentDto,
      user,
    });
    return this.paymentRepository.save(payment);
  }

  async findAll(userId?: number, date?: string): Promise<Payment[]> {
    const query = this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.user', 'user');
    if (userId) {
      query.where('payment.user = :userId', { userId });
    }
    if (date) {
      query.andWhere('payment.date = :date', { date });
    }
    return query.getMany();
  }
}