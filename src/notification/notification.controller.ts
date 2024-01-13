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
import { NotificationService } from './notification.service';
import { ShopService } from 'src/shop/shop.service';
import { CustomerService } from 'src/customer/customer.service';
import { FollowService } from 'src/follow/follow.service';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly shopService: ShopService,
    private readonly customerService: CustomerService,
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

      return this.notificationService.findAllNotification();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get(':notification_id')
  async findOne(@Req() request, @Param('notification_id') notificationid) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      return this.notificationService.findById(Number(notificationid));
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get('customer/:customer_id')
  async findOneByCustomerId(@Req() request, @Param('customer_id') customerid) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      return this.notificationService.findByCustomerId(Number(customerid));
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

      const shop = await this.shopService.findById(Number(body.details.shop_id));

      if (!shop) {
        throw new BadRequestException('No Shop Found.');
      }

      const customer = await this.customerService.findById(Number(body.details.customer_id));

      if (!customer) {
        throw new BadRequestException('No Customer Found.');
      }

      const shopFollowers = await this.followService.findByShopId(shop.id);

        // Using the map function to iterate over the array
      const notifications = await Promise.all(shopFollowers.map(async (notification) => {
        const notificationId = randomUuid(14, 'ALPHANUM');
        const createdNotification = await this.notificationService.createNotification(body.details, notificationId, notification.shop, notification.customer);
        return createdNotification;
      }));

      return { message: 'Added Seller Withdrawal Successfully.' };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Patch('deactivate/:notification_id')
  async deactivateNotification(@Param('notification_id') notificationId, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const notification = await this.notificationService.findById(Number(notificationId));

      if (!notification) {
        throw new BadRequestException('No Seller Balance Found.');
      }

      await this.notificationService.deactivateNotification(Number(notification.id));

      return { message: 'Deactivated Seller Balance Successfully.' };
    } catch (e) {
      if (e.response.message === 'No Seller Balance Found.') {
        throw new BadRequestException('No Seller Balance Found.');
      }
      throw new UnauthorizedException();
    }
  }

  @Patch('activate/:notification_id')
  async activateNotification(@Param('notification_id') notificationId, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const notification = await this.notificationService.findById(Number(notificationId));

      if (!notification) {
        throw new BadRequestException('No Seller Balance Found.');
      }

      await this.notificationService.activateNotification(Number(notification.id));

      return { message: 'Activated Seller Balance Successfully.' };
    } catch (e) {
      if (e.response.message === 'No Seller Balance Found.') {
        throw new BadRequestException('No Seller Balance Found.');
      }
      throw new UnauthorizedException();
    }
  }
}
