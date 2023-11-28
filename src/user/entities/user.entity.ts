import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

export enum UserType {
  Customer = 0,
  Seller = 1,
  Admin = 2,
  SuperAdmin = 3,
}

export enum ActiveType {
  NotActive = 0,
  Active = 1,
}

@Entity()
@Unique(['email'])
export class User {
  /**
   * this decorator will help to auto generate id for the table.
   */
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 40 })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'enum', enum: UserType, default: UserType.SuperAdmin, nullable: true })
  user_type: number;

  @Column({ type: 'enum', enum: ActiveType, default: ActiveType.Active, nullable: true })
  is_active: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
