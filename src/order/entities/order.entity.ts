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

export enum DeliveryStatusType {
  Processing = 'Processing',
  Packed = 'Packed',
  Shipped = 'Shipped',
  OutForDelivery = 'Out For Delivery',
  Delivered = 'Delivered',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 15 })
  order_id: string;

  @ManyToOne(() => Customer)
  @JoinColumn()
  customer: Customer;

  @ManyToOne(() => Shop)
  @JoinColumn()
  shop: Shop;

  @ManyToOne(() => Product)
  @JoinColumn()
  product: Product;

  @Column({
    type: 'enum',
    enum: ['Processing', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered'],
  })
  /**
   * Processing - Processing
   * Packed - Packed
   * Shipped - Shipped
   * Out For Delivery - Out For Delivery
   * Delivered - Delivered
   */
  status: string;

  @Column({ type: 'enum', enum: ActiveType })
  is_active: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
