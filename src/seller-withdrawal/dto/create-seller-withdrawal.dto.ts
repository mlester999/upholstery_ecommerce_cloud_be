import {
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
  import { ActiveType } from 'src/user/entities/user.entity';
import { SellerWithdrawalStatusType } from '../entities/seller-withdrawal.entity';
  
  export class CreateSellerWithdrawalDto {
    @IsNumber()
    amount: number;

    @IsString()
    @IsEnum(SellerWithdrawalStatusType)
    status: string;
  
    @IsOptional()
    @IsNumber()
    @IsEnum(ActiveType)
    is_active: number;
  }
  