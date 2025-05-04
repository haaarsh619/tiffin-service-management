import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from '../entities/invoice.entity';
import { User } from '../entities/user.entity';
import { Order } from '../entities/order.entity';
import { Payment } from '../entities/payment.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const { userId, month } = createInvoiceDto;
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const invoice = this.invoiceRepository.create({
      ...createInvoiceDto,
      user,
    });
    return this.invoiceRepository.save(invoice);
  }

  async generateInvoice(userId: number, month: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.user = :userId', { userId })
      .andWhere('order.date LIKE :month', { month: `${month}%` })
      .getMany();

    const payments = await this.paymentRepository
      .createQueryBuilder('payment')
      .where('payment.user = :userId', { userId })
      .andWhere('payment.date LIKE :month', { month: `${month}%` })
      .getMany();

    const totalOrders = orders.reduce((sum, order) => sum + order.price, 0);
    const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);

    return {
      user,
      month,
      orders,
      payments,
      totalOrders,
      totalPayments,
      balance: totalOrders - totalPayments,
    };
  }
}