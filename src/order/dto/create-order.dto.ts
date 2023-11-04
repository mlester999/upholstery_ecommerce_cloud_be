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

  @IsString()
  @IsOptional()
  source_id: string;

  // @IsString()
  // @IsEnum(['Processing', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered'])
  // status: string;

  @IsString()
  @IsEnum(['Cash on Delivery', 'GCash', 'Grab Pay'])
  payment_method: string;

  @IsNumber()
  @IsNotEmpty()
  total_quantity: number;

  @IsNumber()
  @IsNotEmpty()
  subtotal_price: number;

  @IsOptional()
  @IsNumber()
  @IsEnum(ActiveType)
  is_active: number;
}
