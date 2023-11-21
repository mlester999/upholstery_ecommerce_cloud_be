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

@Entity()
export class BankAccount {
  @PrimaryGeneratedColumn()
  id: number;

  // Define the one-to-one relationship with Seller
  @ManyToOne(() => Seller)
  @JoinColumn() // Specify the name of the foreign key column in Seller
  seller: Seller; // Create a property to access the related Seller entity

  @Column({
    type: 'enum',
    enum: ['GCash', 'Grab Pay'],
  })
  name: string;

  @Column({ type: 'varchar', length: 11 })
  contact_number: string;

  @Column({ type: 'timestamp', nullable: true })
  contact_number_verified_at: Date;

  @Column({ type: 'enum', enum: ActiveType })
  is_active: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
