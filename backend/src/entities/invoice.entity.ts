import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'varchar', length: 7 }) // Format: YYYY-MM
  month: string;

  @Column({ type: 'float' })
  totalOrders: number;

  @Column({ type: 'float' })
  totalPayments: number;
}