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
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';



@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 15 })
  review_id: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  order_id: string;

  // Define the one-to-one relationship with Customer
  @ManyToOne(() => Customer)
  @JoinColumn() // Specify the name of the foreign key column in Customer
  customer: Customer; // Create a property to access the related Customer entity

  // Define the one-to-one relationship with Seller
  @ManyToOne(() => Shop)
  @JoinColumn() // Specify the name of the foreign key column in Shop
  shop: Shop; // Create a property to access the related Shop entity

  // Define the one-to-one relationship with Seller
  @ManyToOne(() => Product)
  @JoinColumn() // Specify the name of the foreign key column in Seller
  product: Product; // Create a property to access the related Seller entity

  @Column({ type: 'text' })
  comments: string;

  @Column({ type: 'int' })
  ratings: number;

  @Column({ type: 'enum', enum: ActiveType })
  is_active: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
