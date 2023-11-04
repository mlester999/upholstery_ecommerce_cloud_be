import { Category } from 'src/category/entities/category.entity';
import { Seller } from 'src/seller/entities/seller.entity';
import { Shop } from 'src/shop/entities/shop.entity';
import { ActiveType } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Category)
  @JoinColumn()
  category: Category;

  @ManyToOne(() => Shop)
  @JoinColumn()
  shop: Shop;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  image_name: string;

  @Column({ type: 'text' })
  image_file: string;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'enum', enum: ActiveType })
  is_active: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
