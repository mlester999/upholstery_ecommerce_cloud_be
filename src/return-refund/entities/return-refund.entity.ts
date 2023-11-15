import { Customer } from 'src/customer/entities/customer.entity';
import { Product } from 'src/product/entities/product.entity';
import { Shop } from 'src/shop/entities/shop.entity';
import { ActiveType } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum ReturnRefundType {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
}

@Entity()
export class ReturnRefund {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 15 })
  return_refund_id: string;

  @Column({ type: 'varchar', length: 15 })
  order_id: string;

  @ManyToOne(() => Customer)
  @JoinColumn()
  customer: Customer;

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'text' })
  image_name: string;

  @Column({ type: 'text' })
  image_file: string;

  // Create an array to hold multiple products
  @Column('jsonb', { nullable: true })
  product?: string;

  @Column({
    type: 'enum',
    enum: ['Pending', 'Accepted', 'Rejected'],
  })
  /**
   * Pending - Pending
   * Accepted - Accepted
   * Rejected - Rejected
   */
  status: string;

  @Column({ type: 'enum', enum: ActiveType })
  is_active: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
