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

export enum SellerWithdrawalStatusType {
    PendingWithdrawal = 'Pending Withdrawal',
    ProcessedWithdrawal = 'Processed Withdrawal',
  }

@Entity()
export class SellerWithdrawal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 15 })
  seller_withdrawal_id: string;

  // Define the one-to-one relationship with Seller
  @ManyToOne(() => Shop)
  @JoinColumn() // Specify the name of the foreign key column in Shop
  shop: Shop; // Create a property to access the related Shop entity

  @Column({ type: 'int' })
  amount: number;

  @Column({
  type: 'enum',
  enum: SellerWithdrawalStatusType,
  })
  /**
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
