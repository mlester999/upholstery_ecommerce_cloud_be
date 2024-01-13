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
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 15 })
  follow_id: string;

  // Define the one-to-one relationship with Shop
  @ManyToOne(() => Shop)
  @JoinColumn() // Specify the name of the foreign key column in Shop
  shop: Shop; // Create a property to access the related Shop entity

  // Define the one-to-one relationship with Customer
  @ManyToOne(() => Customer)
  @JoinColumn() // Specify the name of the foreign key column in Customer
  customer: Customer; // Create a property to access the related Customer entity

  @Column({ type: 'enum', enum: ActiveType })
  is_active: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
