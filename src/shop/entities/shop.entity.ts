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
} from 'typeorm';

@Entity()
export class Shop {
  @PrimaryGeneratedColumn()
  id: number;

  // Define the one-to-one relationship with Seller
  @OneToOne(() => Seller)
  @JoinColumn() // Specify the name of the foreign key column in Seller
  seller: Seller; // Create a property to access the related Seller entity

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: ActiveType })
  is_active: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
