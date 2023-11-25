import {
  Body,
  Controller,
  Delete,
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
import { FollowService } from './follow.service';
import { ShopService } from 'src/shop/shop.service';
import { CustomerService } from 'src/customer/customer.service';

@Controller('follow')
export class FollowController {
  constructor(
    private readonly followService: FollowService,
    private readonly shopService: ShopService,
    private readonly customerService: CustomerService,
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

      return this.followService.findAllFollow();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get(':follow_id')
  async findOne(@Req() request, @Param('follow_id') followid) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      return this.followService.findById(Number(followid));
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('add')
  async addFollow(@Body() body: any, @Req() request, @Ip() ip) {
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

      const followId = randomUuid(14, 'ALPHANUM');
      
      const createdFollow = await this.followService.createFollow(followId, shop, customer);

      return { message: 'Added Seller Withdrawal Successfully.' };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Delete('unfollow/:follow_id')
  async unfollowShop(@Param('follow_id') followId, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const follow = await this.followService.findById(Number(followId));

      if (!follow) {
        throw new BadRequestException('No Follow Found.');
      }

      await this.followService.unfollowShop(Number(follow.id));

      return { message: 'Unfollow Shop Successfully.' };
    } catch (e) {
      if (e.response.message === 'No Follow Found.') {
        throw new BadRequestException('No Follow Found.');
      }
      throw new UnauthorizedException();
    }
  }

  @Patch('deactivate/:follow_id')
  async deactivateFollow(@Param('follow_id') followId, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const follow = await this.followService.findById(Number(followId));

      if (!follow) {
        throw new BadRequestException('No Follow Found.');
      }

      await this.followService.deactivateFollow(Number(follow.id));

      return { message: 'Deactivated Follow Successfully.' };
    } catch (e) {
      if (e.response.message === 'No Follow Found.') {
        throw new BadRequestException('No Follow Found.');
      }
      throw new UnauthorizedException();
    }
  }

  @Patch('activate/:follow_id')
  async activateFollow(@Param('follow_id') followId, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const follow = await this.followService.findById(Number(followId));

      if (!follow) {
        throw new BadRequestException('No Follow Found.');
      }

      await this.followService.activateFollow(Number(follow.id));

      return { message: 'Activated Follow Successfully.' };
    } catch (e) {
      if (e.response.message === 'No Follow Found.') {
        throw new BadRequestException('No Follow Found.');
      }
      throw new UnauthorizedException();
    }
  }
}
