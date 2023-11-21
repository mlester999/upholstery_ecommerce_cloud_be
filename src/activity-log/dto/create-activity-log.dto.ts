import {
    IsNotEmpty,
    IsString,
  } from 'class-validator';
  
  export class CreateActivityLogDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;
  
    @IsNotEmpty()
    @IsString()
    ip_address: string;
  }
  