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
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';
import { AdminService } from 'src/admin/admin.service';
import { UserType } from 'src/user/entities/user.entity';
import { CustomerService } from 'src/customer/customer.service';
import { CreateCustomerDto } from 'src/customer/dto/create-customer.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminService,
    private readonly customerService: CustomerService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/customer/sign-up')
  async customerSignUp(
    @Body() createUserDto: CreateUserDto,
    @Body() createCustomerDto: CreateCustomerDto,
  ) {
    const user = await this.userService.createUser(
      createUserDto,
      UserType.Customer,
    );

    if (!user) {
      throw new BadRequestException('Failed creating a user.');
    }

    const customer = await this.customerService.createCustomer(
      createCustomerDto,
      user,
    );

    return { user, customer };
  }

  @Post('/admin/sign-up')
  async adminSignUp(
    @Body() createUserDto: CreateUserDto,
    @Body() createAdminDto: CreateAdminDto,
  ) {
    const user = await this.userService.createUser(
      createUserDto,
      UserType.Admin,
    );

    if (!user) {
      throw new BadRequestException('Failed creating a user.');
    }

    const admin = await this.adminService.createAdmin(createAdminDto, user);

    return { user, admin };
  }

  @Post('/admin/login')
  async adminLogin(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res,
  ) {
    const admin = await this.adminService.findByEmail(email);

    if (!admin) {
      throw new BadRequestException(
        'No account is associated with the email provided.',
      );
    }

    if (!(await bcrypt.compare(password, admin.user.password))) {
      throw new BadRequestException('Invalid credentials.');
    }

    const jwt = await this.jwtService.signAsync({
      id: admin.id,
      user_id: admin.user.id,
    });

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
  async getUser(@Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const user = await this.userService.findById(parseInt(data['user_id']));

      if (user.user_type === UserType.Admin) {
        const admin = await this.adminService.findById(parseInt(data['id']));

        const { password, ...result } = user;

        return {
          user: result,
          ...admin,
        };
      } else {
        return { message: 'No User found.' };
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('user')
  async updateUser(@Body() body: any, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      if (Object.keys(body.details).length === 0) return;

      if (body?.details.email) {
        await this.userService.updateUser(
          body.details.user_id,
          body.details.email,
        );
      }

      const admin = await this.adminService.findById(body.details.id);

      if (admin.user.user_type === UserType.Admin) {
        await this.adminService.updateAdmin(body);

        return { message: 'Updated details successfully.' };
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('password')
  async updatePass(@Body() body: any, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      if (Object.keys(body.details).length === 0) return;

      const userId = parseInt(data['user_id']);

      const user = await this.userService.findById(userId);

      const salt = await bcrypt.genSalt();
      const hashedCurrentPassword = await bcrypt.hash(
        body.details.current_password,
        salt,
      );

      if (bcrypt.compareSync(user.password, hashedCurrentPassword)) {
        if (body.details.new_password === body.details.confirm_new_password) {
          await this.userService.updatePassword(
            userId,
            body.details.new_password,
          );
        } else {
          throw new BadRequestException(
            'The new password and the confirm new password does not match.',
          );
        }
      } else {
        throw new BadRequestException(
          'The current password that you provided is wrong.',
        );
      }

      return { message: 'Updated password successfully.' };
    } catch (e) {
      console.log(e);
      if (
        e.response?.message ===
        'The new password and the confirm new password does not match.'
      ) {
        throw new BadRequestException(
          'The new password and the confirm new password does not match.',
        );
      } else if (
        e.response?.message ===
        'The current password that you provided is wrong.'
      ) {
        throw new BadRequestException(
          'The current password that you provided is wrong.',
        );
      }

      throw new UnauthorizedException();
    }
  }
}
