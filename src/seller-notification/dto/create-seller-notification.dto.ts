import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
  import { ActiveType } from 'src/user/entities/user.entity';
  
  export class CreateSellerNotificationDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;
  
    @IsNotEmpty()
    @IsNumber()
    @IsEnum(ActiveType)
    is_active: number;
  }
  