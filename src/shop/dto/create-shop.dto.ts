import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ActiveType } from 'src/user/entities/user.entity';

export class CreateShopDto {
  @IsString()
  @MinLength(2, { message: 'Shop Name must have atleast 2 characters.' })
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(2, { message: 'Description must have atleast 2 characters.' })
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsNumber()
  @IsEnum(ActiveType)
  is_active: number;
}
