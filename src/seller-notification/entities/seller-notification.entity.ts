import { Admin } from 'src/admin/entities/admin.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Seller } from 'src/seller/entities/seller.entity';
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



@Entity()
export class SellerNotification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 15 })
  seller_notification_id: string;
  
  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  // Define the one-to-one relationship with Admin
  @ManyToOne(() => Admin)
  @JoinColumn() // Specify the name of the foreign key column in Admin
  admin: Admin; // Create a property to access the related Admin entity

  // Define the one-to-one relationship with Seller
  @ManyToOne(() => Seller)
  @JoinColumn() // Specify the name of the foreign key column in Seller
  seller: Seller; // Create a property to access the related Seller entity

  @Column({ type: 'enum', enum: ActiveType })
  is_active: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
