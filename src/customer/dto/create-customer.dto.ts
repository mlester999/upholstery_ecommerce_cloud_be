import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { IsUnique } from 'src/is-unique.validator';

export class CreateCustomerDto {
  @IsString()
  @MinLength(2, { message: 'First Name must have atleast 2 characters.' })
  @IsNotEmpty()
  first_name: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Middle Name must have atleast 2 characters.' })
  middle_name: string;

  @IsString()
  @MinLength(2, { message: 'Last Name must have atleast 2 characters.' })
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsEnum(['Female', 'Male'])
  gender: string;

  @IsDateString()
  @IsNotEmpty()
  birth_date: Date;

  @IsString()
  @Matches(/^09\d{9}$/)
  @IsUnique({tableName: 'customer', column: 'contact_number'})
  contact_number: string;

  @IsDate()
  @IsOptional()
  contact_number_verified_at: Date;

  @IsString()
  @MinLength(2, { message: 'Region must have atleast 2 characters.' })
  @IsNotEmpty()
  region: string;

  @IsString()
  @MinLength(2, { message: 'Province must have atleast 2 characters.' })
  @IsNotEmpty()
  province: string;

  @IsString()
  @MinLength(2, { message: 'City must have atleast 2 characters.' })
  @IsNotEmpty()
  city: string;

  @IsString()
  @MinLength(2, { message: 'Barangay must have atleast 2 characters.' })
  @IsNotEmpty()
  barangay: string;

  @IsString()
  @MinLength(2, { message: 'Zip Code must have atleast 2 characters.' })
  @IsNotEmpty()
  zip_code: string;

  @IsString()
  @MinLength(2, { message: 'Street Address must have atleast 2 characters.' })
  @IsNotEmpty()
  street_address: string;
}
