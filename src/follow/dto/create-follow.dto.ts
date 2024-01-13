import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
  import { ActiveType } from 'src/user/entities/user.entity';
  
  export class CreateFollowDto {  
    @IsNotEmpty()
    @IsNumber()
    @IsEnum(ActiveType)
    is_active: number;
  }
  