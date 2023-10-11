import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { response } from 'express';
import { UserType } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { CustomerService } from './customer.service';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('all')
  async findAll(@Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      return this.customerService.findAllCustomer();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get(':customer_id')
  async findOne(@Req() request, @Param('customer_id') customerId) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      return this.customerService.findById(parseInt(customerId));
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('add')
  async addCustomer(@Body() body: any, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      if (Object.keys(body.details).length === 0) return;

      const customer = await this.customerService.findByEmail(
        body?.details.email,
      );

      if (customer) {
        throw new BadRequestException(
          'The email address that you provided is already taken.',
        );
      }

      const newUser = await this.userService.createUser(
        body.details,
        UserType.Customer,
      );

      if (!newUser) {
        throw new BadRequestException('Failed creating a user.');
      }

      await this.customerService.createCustomer(body.details, newUser);

      return { message: 'Created Customer Successfully.' };
    } catch (e) {
      if (
        e.response.message ===
        'The email address that you provided is already taken.'
      ) {
        throw new BadRequestException(
          'The email address that you provided is already taken.',
        );
      }
      throw new UnauthorizedException();
    }
  }

  @Patch('update/:customer_id')
  async updateCustomer(
    @Body() body: any,
    @Param('customer_id') customerId,
    @Req() request,
  ) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      if (Object.keys(body.details).length === 0) return;

      if (body?.details.email) {
        const customer = await this.customerService.findByEmail(
          body.details.email,
        );

        if (customer) {
          throw new BadRequestException(
            'The email address that you provided is already taken.',
          );
        } else {
          await this.userService.updateUser(
            body.details.user_id,
            body.details.email,
          );
        }
      }

      const customer = await this.customerService.findById(body.details.id);

      if (customer.user.user_type === UserType.Customer) {
        await this.customerService.updateCustomer(body, parseInt(customerId));

        return { message: 'Updated customer details successfully.' };
      }
    } catch (e) {
      if (
        e.response.message ===
        'The email address that you provided is already taken.'
      ) {
        throw new BadRequestException(
          'The email address that you provided is already taken.',
        );
      }
      throw new UnauthorizedException();
    }
  }

  @Patch('deactivate/:customer_id')
  async deactivateCustomer(@Param('customer_id') customerId, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const customer = await this.customerService.findById(customerId);

      if (!customer) {
        throw new BadRequestException('No Customer Found.');
      }

      if (customer.user.user_type === UserType.Customer) {
        await this.userService.deactivateUser(customer.user.id);

        return { message: 'Deactivated customer successfully.' };
      }
    } catch (e) {
      if (e.response.message === 'No Customer Found.') {
        throw new BadRequestException('No Customer Found.');
      }
      throw new UnauthorizedException();
    }
  }

  @Patch('activate/:customer_id')
  async activateCustomer(@Param('customer_id') customerId, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const customer = await this.customerService.findById(customerId);

      if (!customer) {
        throw new BadRequestException('No Customer Found.');
      }

      if (customer.user.user_type === UserType.Customer) {
        await this.userService.activateUser(customer.user.id);

        return { message: 'Activated customer successfully.' };
      }
    } catch (e) {
      if (e.response.message === 'No Customer Found.') {
        throw new BadRequestException('No Customer Found.');
      }
      throw new UnauthorizedException();
    }
  }
}
