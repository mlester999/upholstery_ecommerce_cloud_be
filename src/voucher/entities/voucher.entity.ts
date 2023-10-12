import { ActiveType } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum VoucherType {
  PriceDiscount = 'Price Discount',
  ShippingDiscount = 'Shipping Discount',
}

export enum VoucherMode {
  Price = 'Price',
  Percentage = 'Percentage',
}

@Entity()
export class Voucher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 15 })
  voucher_id: string;

  @Column({ type: 'varchar', length: 100 })
  voucher_code: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int' })
  amount: number;

  @Column({
    type: 'enum',
    enum: ['Price', 'Percentage'],
  })
  /**
   * PriceDiscount - Price Discount
   * ShippingDiscount - Shipping Discount
   */
  mode: string;

  @Column({
    type: 'enum',
    enum: ['Price Discount', 'Shipping Discount'],
  })
  /**
   * PriceDiscount - Price Discount
   * ShippingDiscount - Shipping Discount
   */
  type: string;

  @Column({ type: 'enum', enum: ActiveType })
  is_active: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
