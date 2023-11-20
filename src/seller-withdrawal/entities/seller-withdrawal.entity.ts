import { Seller } from 'src/seller/entities/seller.entity';
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
  @ManyToOne(() => Seller)
  @JoinColumn() // Specify the name of the foreign key column in Seller
  seller: Seller; // Create a property to access the related Seller entity

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
