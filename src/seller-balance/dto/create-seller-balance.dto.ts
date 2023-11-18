import {
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
  import { ActiveType } from 'src/user/entities/user.entity';
import { SellerBalanceStatusType } from '../entities/seller-balance.entity';
  
  export class CreateSellerBalanceDto {
    @IsNumber()
    amount: number;

    @IsString()
    @IsEnum(SellerBalanceStatusType)
    status: string;
  
    @IsOptional()
    @IsNumber()
    @IsEnum(ActiveType)
    is_active: number;
  }
  