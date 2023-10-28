import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ActiveType } from 'src/user/entities/user.entity';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  order_id: string;

  @IsOptional()
  @IsNumber()
  quantity: number;

  @IsString()
  @IsEnum(['Processing', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered'])
  status: string;

  @IsOptional()
  @IsNumber()
  @IsEnum(ActiveType)
  is_active: number;
}
