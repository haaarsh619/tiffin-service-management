import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'varchar', length: 7 }) // Format: YYYY-MM
  month: string;

  @Column({ type: 'float' })
  amount: number; // Total order amount for the month

  @Column({ type: 'float', default: 0 })
  paidAmount: number; // Amount paid by user

  @Column({ type: 'varchar', length: 50, nullable: true })
  paymentMethod: string; // e.g., "Cash", "UPI"

  @Column({ type: 'varchar', length: 10, default: 'unpaid' })
  status: 'paid' | 'unpaid';
}