import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
  import { ActiveType } from 'src/user/entities/user.entity';
import { SellerWithdrawalStatusType } from '../entities/seller-withdrawal.entity';
  
  export class CreateSellerWithdrawalDto {
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsNumber()
    @IsNotEmpty()
    commission_fee: number;

    @IsNumber()
    @IsNotEmpty()
    total_withdrawal: number;

    @IsString()
    @IsEnum(SellerWithdrawalStatusType)
    @IsNotEmpty()
    status: string;
  
    @IsNotEmpty()
    @IsNumber()
    @IsEnum(ActiveType)
    is_active: number;
  }
  