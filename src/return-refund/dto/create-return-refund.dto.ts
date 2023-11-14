import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
  import { ActiveType } from 'src/user/entities/user.entity';
import { ReturnRefundType } from '../entities/return-refund.entity';
  
  export class CreateReturnRefundDto {
    @IsString()
    @IsNotEmpty()
    return_refund_id: string;

    @IsString()
    @IsNotEmpty()
    order_id: string;

    @IsString()
    @IsNotEmpty()
    reason: string;

    @IsString()
    @IsNotEmpty()
    image_name: string;
  
    @IsString()
    @IsNotEmpty()
    image_file: string;
  
    @IsOptional()
    @IsString()
    @IsEnum(ReturnRefundType)
    status: string;
  
    @IsOptional()
    @IsNumber()
    @IsEnum(ActiveType)
    is_active: number;
  }
  