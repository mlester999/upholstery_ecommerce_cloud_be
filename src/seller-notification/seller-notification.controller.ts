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
import { ActivityLogService } from 'src/activity-log/activity-log.service';
import { randomUuid } from '../../utils/generateUuid';
import { SellerBalanceService } from 'src/seller-balance/seller-balance.service';
import { SellerBalanceStatusType } from 'src/seller-balance/entities/seller-balance.entity';
import { SellerService } from 'src/seller/seller.service';
import { SellerNotificationService } from './seller-notification.service';
import { ShopService } from 'src/shop/shop.service';
import { CustomerService } from 'src/customer/customer.service';
import { FollowService } from 'src/follow/follow.service';
import { AdminService } from 'src/admin/admin.service';

@Controller('seller-notification')
export class SellerNotificationController {
  constructor(
    private readonly sellerNotificationService: SellerNotificationService,
    private readonly adminService: AdminService,
    private readonly sellerService: SellerService,
    private readonly followService: FollowService,
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

      return this.sellerNotificationService.findAllSellerNotification();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get(':seller_notification_id')
  async findOne(@Req() request, @Param('seller_notification_id') sellerNotificationid) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      return this.sellerNotificationService.findById(Number(sellerNotificationid));
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get('seller/:seller_id')
  async findOneByCustomerId(@Req() request, @Param('seller_id') sellerid) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      return this.sellerNotificationService.findBySellerId(Number(sellerid));
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('add')
  async addNotification(@Body() body: any, @Req() request, @Ip() ip) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      if (Object.keys(body.details).length === 0) return;

      const admin = await this.adminService.findById(Number(body.details.admin_id));

      if (!admin) {
        throw new BadRequestException('No Admin Found.');
      }

      const seller = await this.sellerService.findById(Number(body.details.seller_id));

      if (!seller) {
        throw new BadRequestException('No Seller Found.');
      }

      const sellerNotificationId = randomUuid(14, 'ALPHANUM');

      const createdNotification = await this.sellerNotificationService.createSellerNotification(body.details, sellerNotificationId, admin, seller);

      return { message: 'Added Seller Withdrawal Successfully.' };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Patch('deactivate/:seller_notification_id')
  async deactivateNotification(@Param('seller_notification_id') sellerNotificationId, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const sellerNotification = await this.sellerNotificationService.findById(Number(sellerNotificationId));

      if (!sellerNotification) {
        throw new BadRequestException('No Seller Balance Found.');
      }

      await this.sellerNotificationService.deactivateSellerNotification(Number(sellerNotification.id));

      return { message: 'Deactivated Seller Balance Successfully.' };
    } catch (e) {
      if (e.response.message === 'No Seller Balance Found.') {
        throw new BadRequestException('No Seller Balance Found.');
      }
      throw new UnauthorizedException();
    }
  }

  @Patch('activate/:seller_notification_id')
  async activateNotification(@Param('seller_notification_id') sellerNotificationId, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const sellerNotification = await this.sellerNotificationService.findById(Number(sellerNotificationId));

      if (!sellerNotification) {
        throw new BadRequestException('No Seller Balance Found.');
      }

      await this.sellerNotificationService.activateSellerNotification(Number(sellerNotification.id));

      return { message: 'Activated Seller Balance Successfully.' };
    } catch (e) {
      if (e.response.message === 'No Seller Balance Found.') {
        throw new BadRequestException('No Seller Balance Found.');
      }
      throw new UnauthorizedException();
    }
  }
}
