import { Product } from 'src/product/entities/product.entity';
import { Shop } from 'src/shop/entities/shop.entity';
import { ActiveType } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

export enum SellerBalanceStatusType {
    Pending = 'Pending',
    Cancelled = 'Cancelled',
    Completed = 'Completed',
    PendingWithdrawal = 'Pending Withdrawal',
    ProcessedWithdrawal = 'Processed Withdrawal',
  }

@Entity()
export class SellerBalance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 15 })
  seller_balance_id: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  order_id: string;

  // Define the one-to-one relationship with Seller
  @ManyToOne(() => Shop)
  @JoinColumn() // Specify the name of the foreign key column in Shop
  shop: Shop; // Create a property to access the related Shop entity

  // Define the one-to-one relationship with Seller
  @ManyToOne(() => Product)
  @JoinColumn() // Specify the name of the foreign key column in Seller
  product: Product; // Create a property to access the related Seller entity

  @Column({ type: 'int' })
  amount: number;

  @Column({
  type: 'enum',
  enum: SellerBalanceStatusType,
  })
  /**
   * Pending - Pending
   * Cancelled - Cancelled
   * Completed - Completed
   * PendingWithdrawal - Pending Withdrawal
   * ProcessedWithdrawal - Processed Withdrawal
   */
  status: string;

  @Column({ type: 'enum', enum: ActiveType })
  is_active: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
