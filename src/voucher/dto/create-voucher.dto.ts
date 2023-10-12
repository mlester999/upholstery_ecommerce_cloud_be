import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ActiveType } from 'src/user/entities/user.entity';

export class CreateVoucherDto {
  @IsString()
  @IsNotEmpty()
  voucher_id: string;

  @IsString()
  @IsNotEmpty()
  voucher_code: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsEnum(['Price', 'Percentage'])
  mode: string;

  @IsString()
  @IsEnum(['Price Discount', 'Shipping Discount'])
  type: string;

  @IsOptional()
  @IsNumber()
  @IsEnum(ActiveType)
  is_active: number;
}
