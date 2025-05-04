import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from '../entities/invoice.entity';
import { User } from '../entities/user.entity';
import { Order } from '../entities/order.entity';
import { Payment } from '../entities/payment.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import * as PDFDocument from 'pdfkit';

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

  async generateInvoice(userId: number, month: string): Promise<Buffer> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.menu', 'menu')
      .where('order.user = :userId', { userId })
      .andWhere('order.date LIKE :month', { month: `${month}%` })
      .getMany();

    const totalAmount = orders.reduce((sum, order) => sum + order.price, 0);

    const payment = await this.paymentRepository.findOneBy({
      user: { id: userId },
      month,
    });

    const totalPaid = payment ? payment.paidAmount : 0;
    const totalDue = payment ? payment.amount - payment.paidAmount : totalAmount;

    // Generating PDF with pdfkit
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const buffers: Buffer[] = [];

    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => {});

    // Header
    doc.fontSize(20).text(`Invoice for ${user.name}`, { align: 'center' });
    doc.fontSize(14).text(`Month: ${month}`, { align: 'center' });
    doc.moveDown(2);

    // User Details
    doc.fontSize(12).text('User Details:', { underline: true });
    doc.text(`Name: ${user.name}`);
    doc.text(`Contact: ${user.contact}`);
    doc.moveDown(2);

    // Payment Summary
    doc.text('Payment Summary:', { underline: true });
    doc.text(`Total Amount: ₹${totalAmount.toFixed(2)}`);
    doc.text(`Paid Amount: ₹${totalPaid.toFixed(2)}`);
    doc.text(`Due Amount: ₹${totalDue.toFixed(2)}`);
    doc.moveDown(2);

    // Footer
    doc.text('Thank you for your business!', { align: 'center' });

    doc.end();

    // Wait for PDF generation
    await new Promise((resolve) => doc.on('end', resolve));
    return Buffer.concat(buffers);
  }
}