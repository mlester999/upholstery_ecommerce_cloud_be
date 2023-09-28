// src/auth/auth.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res,
  ) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new BadRequestException(
        'No account is associated with the email provided.',
      );
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials.');
    }

    const jwt = await this.jwtService.signAsync({ id: user.id });

    res.cookie('user_token', jwt, {
      expires: new Date(Date.now() + 3 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return { message: 'Login successfully.' };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res) {
    res.clearCookie('user_token', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return { message: 'Logout successfully.' };
  }

  @Get('user')
  async user(@Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const user = await this.userService.findById(parseInt(data['id']));

      const { password, ...result } = user;

      return result;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
