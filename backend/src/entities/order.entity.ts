import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Menu } from './menu.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Menu, (menu) => menu.id, { onDelete: 'RESTRICT' })
  menu: Menu;

  @Column({ type: 'varchar', length: 10 })
  date: string; // Format: YYYY-MM-DD

  @Column({ type: 'float' })
  price: number;
}