import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
  import { ActiveType } from 'src/user/entities/user.entity';
import { SellerBalanceStatusType } from '../entities/seller-balance.entity';
  
  export class CreateSellerBalanceDto {
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsEnum(SellerBalanceStatusType)
    @IsNotEmpty()
    status: string;
  
    @IsNotEmpty()
    @IsNumber()
    @IsEnum(ActiveType)
    is_active: number;
  }
  