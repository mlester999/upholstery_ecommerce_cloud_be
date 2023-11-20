import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
  import { ActiveType } from 'src/user/entities/user.entity';

  
  export class CreateReviewDto {
    @IsString()
    @IsNotEmpty()
    comments: string;

    @IsNumber()
    @IsNotEmpty()
    ratings: number;

    @IsNumber()
    @IsNotEmpty()
    amount: number;
  
    @IsNumber()
    @IsEnum(ActiveType)
    is_active: number;
  }
  