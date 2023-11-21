import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ActiveType } from 'src/user/entities/user.entity';

export class CreateBankAccountDto {
  @IsString()
  @IsEnum(['GCash', 'Grab Pay'])
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^09\d{9}$/)
  contact_number: string;

  @IsNotEmpty()
  @IsNumber()
  @IsEnum(ActiveType)
  is_active: number;
}
