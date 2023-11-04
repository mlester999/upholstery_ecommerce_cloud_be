import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ActiveType } from 'src/user/entities/user.entity';

export class CreateProductDto {
  @IsString()
  @MinLength(2, { message: 'Product Name must have atleast 2 characters.' })
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(2, { message: 'Product Slug must have atleast 2 characters.' })
  @IsNotEmpty()
  slug: string;

  @IsString()
  @MinLength(2, {
    message: 'Product Description must have atleast 2 characters.',
  })
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  image_name: string;

  @IsString()
  @IsNotEmpty()
  image_file: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsOptional()
  @IsNumber()
  @IsEnum(ActiveType)
  is_active: number;
}
