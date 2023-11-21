import {
  Body,
  Controller,
  Get,
  Ip,
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
import { SellerService } from './seller.service';
import { ActivityLogService } from 'src/activity-log/activity-log.service';

@Controller('seller')
export class SellerController {
  constructor(
    private readonly sellerService: SellerService,
    private readonly userService: UserService,
    private readonly activityLogService: ActivityLogService,
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

      return this.sellerService.findAllSeller();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get(':seller_id')
  async findOne(@Req() request, @Param('seller_id') sellerId) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      return this.sellerService.findById(parseInt(sellerId));
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('add')
  async addSeller(@Body() body: any, @Req() request, @Ip() ip) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      if (Object.keys(body.details).length === 0) return;

      const sellerEmail = await this.sellerService.findByEmail(body?.details.email);

      if (sellerEmail) {
        throw new BadRequestException(
          'The email address that you provided is already taken.',
        );
      }

      const sellerContact = await this.sellerService.findByContactNumber(
        body?.details.contact_number,
      );

      if (sellerContact) {
        throw new BadRequestException(
          'The contact number that you provided is already taken.',
        );
      }

      const newUser = await this.userService.createUser(
        body.details,
        UserType.Seller,
      );

      if (!newUser) {
        throw new BadRequestException('Failed creating a user.');
      }

      const createdSeller = await this.sellerService.createSeller(body.details, newUser);

      await this.activityLogService.createActivityLog({title: 'create-seller', description: `A new seller named ${createdSeller.first_name} ${createdSeller.last_name} was created.`, ip_address: ip});

      return { message: 'Created Seller Successfully.' };
    } catch (e) {
      if (
        e.response.message ===
        'The email address that you provided is already taken.'
      ) {
        throw new BadRequestException(
          'The email address that you provided is already taken.',
        );
      }

      if (
        e.response.message ===
        'The contact number that you provided is already taken.'
      ) {
        throw new BadRequestException(
          'The contact number that you provided is already taken.',
        );
      }
      throw new UnauthorizedException();
    }
  }

  @Post('new')
  async newSeller(@Body() body: any, @Req() request, @Ip() ip) {
    try {
      if (Object.keys(body.details).length === 0) return;

      if (body.details.password !== body.details.confirm_password) {
        throw new BadRequestException(
          'The password that you provided does not match.',
        );
      }

      const sellerEmail = await this.sellerService.findByEmail(body?.details.email);

      if (sellerEmail) {
        throw new BadRequestException(
          'The email address that you provided is already taken.',
        );
      }
      
      const sellerContact = await this.sellerService.findByContactNumber(
        body?.details.contact_number,
      );

      if (sellerContact) {
        throw new BadRequestException(
          'The contact number that you provided is already taken.',
        );
      }

      const newUser = await this.userService.createNewUser(
        body.details,
        UserType.Seller,
      );

      if (!newUser) {
        throw new BadRequestException('Failed creating a user.');
      }

      const createdSeller = await this.sellerService.createSeller(body.details, newUser);

      await this.activityLogService.createActivityLog({title: 'create-seller', description: `A new seller named ${createdSeller.first_name} ${createdSeller.last_name} was created.`, ip_address: ip});

      return { message: 'Created Seller Successfully.' };
    } catch (e) {
      if (
        e.response.message ===
        'The email address that you provided is already taken.'
      ) {
        throw new BadRequestException(
          'The email address that you provided is already taken.',
        );
      }

      if (
        e.response.message ===
        'The contact number that you provided is already taken.'
      ) {
        throw new BadRequestException(
          'The contact number that you provided is already taken.',
        );
      }
      throw new UnauthorizedException();
    }
  }

  @Patch('update/:seller_id')
  async updateSeller(
    @Body() body: any,
    @Param('seller_id') sellerId,
    @Req() request,
    @Ip() ip
  ) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      if (Object.keys(body.details).length === 0) return;

      if (body?.details.email) {
        const seller = await this.sellerService.findByEmail(body.details.email);

        if (seller) {
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

      const seller = await this.sellerService.findById(body.details.id);

      if (seller.user.user_type === UserType.Seller) {
        const updatedSeller = await this.sellerService.updateSeller(body);

        await this.activityLogService.createActivityLog({title: 'update-seller', description: `A seller named ${updatedSeller.first_name} ${updatedSeller.last_name} has updated its account information.`, ip_address: ip});

        return { message: 'Updated seller details successfully.' };
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

  @Patch('verify-contact-number/:seller_id')
  async verifyCustomerContactNumber(
    @Body() body: any,
    @Param('seller_id') sellerId,
    @Req() request,
    @Ip() ip
  ) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      if (Object.keys(body.details).length === 0) return;

      const customer = await this.sellerService.findById(Number(sellerId));

      if (customer.user.user_type === UserType.Seller) {
        const updatedSeller = await this.sellerService.verifyPhoneNumber(Number(sellerId));

        await this.activityLogService.createActivityLog({title: 'verify-seller-number', description: `A seller named ${updatedSeller.first_name} ${updatedSeller.last_name} has verified its phone number.`, ip_address: ip});

        return { message: 'Verified Phone Number Successfully.' };
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Patch('deactivate/:seller_id')
  async deactivateSeller(@Param('seller_id') sellerId, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const seller = await this.sellerService.findById(sellerId);

      if (!seller) {
        throw new BadRequestException('No Seller Found.');
      }

      if (seller.user.user_type === UserType.Seller) {
        await this.userService.deactivateUser(seller.user.id);

        return { message: 'Deactivated seller successfully.' };
      }
    } catch (e) {
      if (e.response.message === 'No Seller Found.') {
        throw new BadRequestException('No Seller Found.');
      }
      throw new UnauthorizedException();
    }
  }

  @Patch('activate/:seller_id')
  async activateSeller(@Param('seller_id') sellerId, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const seller = await this.sellerService.findById(sellerId);

      if (!seller) {
        throw new BadRequestException('No Seller Found.');
      }

      if (seller.user.user_type === UserType.Seller) {
        await this.userService.activateUser(seller.user.id);

        return { message: 'Activated seller successfully.' };
      }
    } catch (e) {
      if (e.response.message === 'No Seller Found.') {
        throw new BadRequestException('No Seller Found.');
      }
      throw new UnauthorizedException();
    }
  }
}
