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

export enum PaymentMethodType {
  CashOnDelivery = 'Cash on Delivery',
  GCash = 'GCash',
  GrabPay = 'Grab Pay',
}

export enum OrderReceivedType {
  OrderPending = 0,
  OrderReceived = 1,
  OrderNotReceived = 2,
}

export enum OrderReviewedType {
  ReviewPending = 0,
  ReviewCompleted = 1,
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  source_id: string;

  @Column({ type: 'varchar', length: 15 })
  order_id: string;

  @ManyToOne(() => Customer)
  @JoinColumn()
  customer: Customer;

  // Create an array to hold multiple products
  @Column('jsonb', { nullable: true })
  products?: string;

  // @Column({
  //   type: 'enum',
  //   enum: ['Processing', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered'],
  // })
  // /**
  //  * Processing - Processing
  //  * Packed - Packed
  //  * Shipped - Shipped
  //  * Out For Delivery - Out For Delivery
  //  * Delivered - Delivered
  //  */
  // status: string;

  @Column({
    type: 'enum',
    enum: ['Cash on Delivery', 'GCash', 'Grab Pay'],
  })
  /**
   * Cash on Delivery - Cash on Delivery
   * GCash - GCash
   * Grab Pay - Grab Pay
   */
  payment_method: string;

  @Column({ type: 'int' })
  total_quantity: number;

  @Column({ type: 'int' })
  subtotal_price: number;

  @Column({ type: 'int' })
  shipping_fee: number;

  @Column({ type: 'int' })
  total_price: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  voucher_code: string;

  @Column({ type: 'int', nullable: true })
  price_discount: number;

  @Column({ type: 'int', nullable: true })
  shipping_discount: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  discount_mode: string;

  @Column({ type: 'enum', enum: ActiveType })
  is_active: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
