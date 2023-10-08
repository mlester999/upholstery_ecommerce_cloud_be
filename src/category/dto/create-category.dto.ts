import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ActiveType } from 'src/user/entities/user.entity';

export class CreateCategoryDto {
  @IsString()
  @MinLength(2, { message: 'Title must have atleast 2 characters.' })
  @IsNotEmpty()
  title: string;

  @IsString()
  @MinLength(2, { message: 'Description must have atleast 2 characters.' })
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsNumber()
  @IsEnum(ActiveType)
  is_active: number;
}
