import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2, { message: 'First Name must have atleast 2 characters.' })
  @IsNotEmpty()
  first_name: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'First Name must have atleast 2 characters.' })
  middle_name: string;

  @IsString()
  @MinLength(2, { message: 'Last Name must have atleast 2 characters.' })
  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsInt()
  age: number;

  @IsString()
  @IsEnum(['F', 'M'])
  gender: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
