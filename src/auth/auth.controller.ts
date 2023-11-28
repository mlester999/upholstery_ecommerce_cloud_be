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
import { ActiveType, UserType } from 'src/user/entities/user.entity';
import { CustomerService } from 'src/customer/customer.service';
import { CreateCustomerDto } from 'src/customer/dto/create-customer.dto';
import { SellerService } from 'src/seller/seller.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminService,
    private readonly sellerService: SellerService,
    private readonly customerService: CustomerService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('create-super-admin-account')
  async createSuperAdminAccount() {
    const details = {email: 'superadmin@email.com', password: '12345678', user_type: UserType.SuperAdmin, is_active: ActiveType.Active}
    
    const user = await this.userService.createUser(
      details,
      UserType.SuperAdmin,
    );

    if (!user) {
      throw new BadRequestException('Failed creating a user.');
    }

    const adminDetails = {first_name: 'Super', middle_name: '', last_name: 'Admin', gender: 'Male', contact_number: '09558369140', contact_number_verified_at: null}

    const admin = await this.adminService.createAdmin(adminDetails, user);

    return 'Super Admin created!';
  }

  // Customer Sign-up API
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

  // Admin Sign-up API
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

  // Customer Login API
  @Post('/customer/login')
  async customerLogin(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res,
  ) {
    const customer = await this.customerService.findByEmail(email);

    if (!customer) {
      throw new BadRequestException(
        'No account is associated with the email provided.',
      );
    }

    if (!(await bcrypt.compare(password, customer.user.password))) {
      throw new BadRequestException('Invalid email or password.');
    }

    const jwt = await this.jwtService.signAsync({
      id: customer.id,
      user_id: customer.user.id,
    });

    res.cookie('user_token', jwt, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return { message: 'Login successfully.' };
  }

  // Seller Login API
  @Post('/seller/login')
  async sellerLogin(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res,
  ) {
    const seller = await this.sellerService.findByEmail(email);

    if (!seller) {
      throw new BadRequestException(
        'No account is associated with the email provided.',
      );
    }

    if (!(await bcrypt.compare(password, seller.user.password))) {
      throw new BadRequestException('Invalid email or password.');
    }

    const jwt = await this.jwtService.signAsync({
      id: seller.id,
      user_id: seller.user.id,
    });

    res.cookie('user_token', jwt, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return { message: 'Login successfully.' };
  }

  // Admin Login API
  @Post('/admin/login')
  async adminLogin(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res,
  ) {
    const admin = await this.adminService.findByEmailAuth(email);

    if (!admin) {
      throw new BadRequestException(
        'No account is associated with the email provided.',
      );
    }

    if (!(await bcrypt.compare(password, admin.user.password))) {
      throw new BadRequestException('Invalid email or password.');
    }

    const jwt = await this.jwtService.signAsync({
      id: admin.id,
      user_id: admin.user.id,
    });

    res.cookie('user_token', jwt, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return { message: 'Login successfully.' };
  }

  // Customer Logout API
  @Post('/customer/logout')
  async customerLogout(@Res({ passthrough: true }) res, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const user = await this.userService.findById(parseInt(data['user_id']));

      if (user.user_type === UserType.Customer) {
        res.clearCookie('user_token', {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        });
        return { message: 'Logout successfully.' };
      } else {
        throw new UnauthorizedException();
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  // Seller Logout API
  @Post('/seller/logout')
  async sellerLogout(@Res({ passthrough: true }) res, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const user = await this.userService.findById(parseInt(data['user_id']));

      if (user.user_type === UserType.Seller) {
        res.clearCookie('user_token', {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        });
        return { message: 'Logout successfully.' };
      } else {
        throw new UnauthorizedException();
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  // Admin Logout API
  @Post('/admin/logout')
  async adminLogout(@Res({ passthrough: true }) res, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const user = await this.userService.findById(parseInt(data['user_id']));

      if (
        user.user_type === UserType.Admin ||
        user.user_type === UserType.SuperAdmin
      ) {
        res.clearCookie('user_token', {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        });
        return { message: 'Logout successfully.' };
      } else {
        throw new UnauthorizedException();
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  // Get Customer User API
  @Get('/customer/user')
  async getCustomerUser(@Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const user = await this.userService.findById(parseInt(data['user_id']));

      if (user.user_type == 0) {
        const customer = await this.customerService.findById(
          parseInt(data['id']),
        );

        if (customer.user.user_type === UserType.Customer) {
          const { password, ...result } = user;

          return {
            user: result,
            ...customer,
          };
        }
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  // Get Seller User API
  @Get('/seller/user')
  async getSellerUser(@Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const user = await this.userService.findById(parseInt(data['user_id']));

      if (user.user_type == 1) {
        const seller = await this.sellerService.findById(parseInt(data['id']));

        if (seller.user.user_type === UserType.Seller) {
          const { password, ...result } = user;

          return {
            user: result,
            ...seller,
          };
        }
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  // Get Admin User API
  @Get('/admin/user')
  async getAdminUser(@Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const user = await this.userService.findById(parseInt(data['user_id']));

      if (user.user_type == 2 || user.user_type == 3) {
        const admin = await this.adminService.findByIdAuth(
          parseInt(data['id']),
        );

        if (
          admin.user.user_type === UserType.Admin ||
          admin.user.user_type === UserType.SuperAdmin
        ) {
          const { password, ...result } = user;

          return {
            user: result,
            ...admin,
          };
        }
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  // Customer Update User API
  @Post('/customer/user')
  async updateCustomerUser(@Body() body: any, @Req() request) {
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

      const customer = await this.customerService.findById(body.details.id);

      if (customer.user.user_type === UserType.Customer) {
        await this.customerService.updateCustomer(body);

        return { message: 'Updated details successfully.' };
      } else {
        throw new UnauthorizedException();
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  // Seller Update User API
  @Post('/seller/user')
  async updateSellerUser(@Body() body: any, @Req() request) {
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

      const seller = await this.sellerService.findById(body.details.id);

      if (seller.user.user_type === UserType.Seller) {
        await this.sellerService.updateSeller(body);

        return { message: 'Updated details successfully.' };
      } else {
        throw new UnauthorizedException();
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  // Admin Update User API
  @Post('/admin/user')
  async updateAdminUser(@Body() body: any, @Req() request) {
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

      if (
        admin.user.user_type === UserType.Admin ||
        admin.user.user_type === UserType.SuperAdmin
      ) {
        await this.adminService.updateAdmin(body);

        return { message: 'Updated details successfully.' };
      } else {
        throw new UnauthorizedException();
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  // Update Customer Password API
  @Post('/customer/password')
  async updateCustomerPass(
    @Body() body: any,
    @Req() request,
    @Res({ passthrough: true }) res,
  ) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      if (Object.keys(body.details).length === 0) return;

      const userId = parseInt(data['user_id']);

      const user = await this.userService.findById(userId);

      if (user.user_type === UserType.Customer) {
        const comparePass = await bcrypt.compare(
          body.details.current_password,
          user.password,
        );

        if (comparePass) {
          if (body.details.new_password === body.details.confirm_new_password) {
            await this.userService.updatePassword(
              userId,
              body.details.new_password,
            );

            await res.clearCookie('user_token', {
              httpOnly: true,
              sameSite: 'none',
              secure: true,
            });

            return { message: 'Updated password successfully.' };
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
      } else {
        throw new UnauthorizedException();
      }
    } catch (e) {
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

  // Update Seller Password API
  @Post('/seller/password')
  async updateSellerPass(
    @Body() body: any,
    @Req() request,
    @Res({ passthrough: true }) res,
  ) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      if (Object.keys(body.details).length === 0) return;

      const userId = parseInt(data['user_id']);

      const user = await this.userService.findById(userId);

      if (user.user_type === UserType.Seller) {
        const comparePass = await bcrypt.compare(
          body.details.current_password,
          user.password,
        );

        if (comparePass) {
          if (body.details.new_password === body.details.confirm_new_password) {
            await this.userService.updatePassword(
              userId,
              body.details.new_password,
            );

            await res.clearCookie('user_token', {
              httpOnly: true,
              sameSite: 'none',
              secure: true,
            });

            return { message: 'Updated password successfully.' };
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
      } else {
        throw new UnauthorizedException();
      }
    } catch (e) {
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

  // Update Admin Password API
  @Post('/admin/password')
  async updateAdminPass(
    @Body() body: any,
    @Req() request,
    @Res({ passthrough: true }) res,
  ) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      if (Object.keys(body.details).length === 0) return;

      const userId = parseInt(data['user_id']);

      const user = await this.userService.findById(userId);

      if (
        user.user_type === UserType.Admin ||
        user.user_type === UserType.SuperAdmin
      ) {
        const comparePass = await bcrypt.compare(
          body.details.current_password,
          user.password,
        );

        if (comparePass) {
          if (body.details.new_password === body.details.confirm_new_password) {
            await this.userService.updatePassword(
              userId,
              body.details.new_password,
            );

            await res.clearCookie('user_token', {
              httpOnly: true,
              sameSite: 'none',
              secure: true,
            });

            return { message: 'Updated password successfully.' };
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
      } else {
        throw new UnauthorizedException();
      }
    } catch (e) {
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
