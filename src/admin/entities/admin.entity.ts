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
export class Admin {
  /**
   * this decorator will help to auto generate id for the table.
   */
  @PrimaryGeneratedColumn()
  id: number;

  // Define the one-to-one relationship with User
  @OneToOne(() => User)
  @JoinColumn() // Specify the name of the foreign key column in Admin
  user: User; // Create a property to access the related User entity

  @Column({ type: 'varchar', length: 30 })
  first_name: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  middle_name: string | null;

  @Column({ type: 'varchar', length: 30 })
  last_name: string;

  @Column({ type: 'enum', enum: ['Male', 'Female'] })
  /**
   * M - Male
   * F - Female
   */
  gender: string;

  @Column({ type: 'varchar', length: 11 })
  contact_number: string;

  
  @Column({ type: 'timestamp', nullable: true })
  contact_number_verified_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
