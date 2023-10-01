import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateAdminDto {
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

  @IsString()
  @Matches(/^09\d{9}$/)
  contact_number: string;
}
