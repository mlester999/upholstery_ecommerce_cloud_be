// src/auth/auth.controller.ts

import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() credentials: { email: string; password: string }) {
    const user = await this.userService.findByEmail(credentials.email);

    if (!user || user.password !== credentials.password) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // Generate and return a JWT token here
    // You'll need to implement JWT token generation logic

    return { message: 'Login successful', token: 'your_generated_token' };
  }
}
