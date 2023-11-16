import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['contact_number'])
export class Seller {
  /**
   * this decorator will help to auto generate id for the table.
   */
  @PrimaryGeneratedColumn()
  id: number;

  // Define the one-to-one relationship with User
  @OneToOne(() => User)
  @JoinColumn() // Specify the name of the foreign key column in Seller
  user: User; // Create a property to access the related User entity

  @Column({ type: 'varchar', length: 30 })
  first_name: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  middle_name: string | null;

  @Column({ type: 'varchar', length: 30 })
  last_name: string;

  @Column({ type: 'enum', enum: ['Male', 'Female'] })
  /**
   * Male - Male
   * Female - Female
   */
  gender: string;

  @Column({ type: 'date' })
  birth_date: Date;

  @Column({ type: 'varchar', length: 11 })
  contact_number: string;

  @Column({ type: 'timestamp', nullable: true })
  contact_number_verified_at: Date;

  @Column({ type: 'varchar', length: 100 })
  region: string;

  @Column({ type: 'varchar', length: 100 })
  province: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 100 })
  barangay: string;

  @Column({ type: 'varchar', length: 10 })
  zip_code: string;

  @Column({ type: 'varchar', length: 255 })
  street_address: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
