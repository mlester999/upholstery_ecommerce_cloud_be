import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsStrongPassword
} from 'class-validator';
import { ActiveType, UserType } from '../entities/user.entity';
import { IsUnique } from 'src/is-unique.validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @IsUnique({tableName: 'user', column: 'email'})
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsNumber()
  @IsEnum(UserType)
  user_type: number;

  @IsOptional()
  @IsNumber()
  @IsEnum(ActiveType)
  is_active: number;
}
