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
import { SellerWithdrawalService } from './seller-withdrawal.service';
import { ShopService } from 'src/shop/shop.service';
import { randomUuid } from '../../utils/generateUuid';
import { SellerBalanceService } from 'src/seller-balance/seller-balance.service';
import { SellerBalanceStatusType } from 'src/seller-balance/entities/seller-balance.entity';

@Controller('seller-withdrawal')
export class SellerWithdrawalController {
  constructor(
    private readonly sellerWithdrawalService: SellerWithdrawalService,
    private readonly sellerBalanceService: SellerBalanceService,
    private readonly shopService: ShopService,
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

      return this.sellerWithdrawalService.findAllSellerWithdrawal();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get(':seller_withdrawal_id')
  async findOne(@Req() request, @Param('seller_withdrawal_id') sellerWithdrawalId) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      return this.sellerWithdrawalService.findById(Number(sellerWithdrawalId));
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('add')
  async addSellerWithdrawal(@Body() body: any, @Req() request, @Ip() ip) {
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

      const sellerWithdrawalId = randomUuid(14, 'ALPHANUM');

      const allCompletedSellerBalance = await this.sellerBalanceService.findAllCompletedSellerBalance();

      const updateCompletedSellerBalance = await Promise.all(allCompletedSellerBalance.map(async (el, i) => {
        await this.sellerBalanceService.updateStatus(SellerBalanceStatusType.PendingWithdrawal, el.id);
      }))
      
      const createdSellerWithdrawal = await this.sellerWithdrawalService.createSellerWithdrawal(body.details, sellerWithdrawalId, shop);

      await this.activityLogService.createActivityLog({title: 'add-seller-withdrawal', description: `A shop named ${createdSellerWithdrawal.shop.name} has withdrawn the balance on its account.`, ip_address: ip});

      return { message: 'Added Seller Withdrawal Successfully.' };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Patch('update/:seller_withdrawal_id')
  async updateSellerWithdrawal(
    @Body() body: any,
    @Param('seller_withdrawal_id') sellerWithdrawalId,
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

     
      const sellerWithdrawal = await this.sellerWithdrawalService.findById(sellerWithdrawalId);

      if (!sellerWithdrawal) {
        throw new BadRequestException('No Seller Balance Found.');
      }

      let shop;

      if(body.details.shop_id) {
        shop = await this.shopService.findById(body.details.shop_id);

        if (!shop) {
          throw new BadRequestException('No Seller Found.');
        }
      }

      const updatedSellerWithdrawal = await this.sellerWithdrawalService.updateSellerWithdrawal(body, sellerWithdrawalId, shop);

      await this.activityLogService.createActivityLog({title: 'update-seller-withdrawal', description: `A shop named ${updatedSellerWithdrawal.shop.name} has an update to its withdrawn balance from its account.`, ip_address: ip});

      return { message: 'Updated Seller Withdrawal Successfully.' };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Patch('deactivate/:seller_withdrawal_id')
  async deactivateSellerWithdrawal(@Param('seller_withdrawal_id') sellerWithdrawalId, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const sellerWithdrawal = await this.sellerWithdrawalService.findById(Number(sellerWithdrawalId));

      if (!sellerWithdrawal) {
        throw new BadRequestException('No Seller Balance Found.');
      }

      await this.sellerWithdrawalService.deactivateSellerWithdrawal(Number(sellerWithdrawal.id));

      return { message: 'Deactivated Seller Balance Successfully.' };
    } catch (e) {
      if (e.response.message === 'No Seller Balance Found.') {
        throw new BadRequestException('No Seller Balance Found.');
      }
      throw new UnauthorizedException();
    }
  }

  @Patch('activate/:seller_withdrawal_id')
  async activateSellerWithdrawal(@Param('seller_withdrawal_id') sellerWithdrawalId, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const sellerWithdrawal = await this.sellerWithdrawalService.findById(Number(sellerWithdrawalId));

      if (!sellerWithdrawal) {
        throw new BadRequestException('No Seller Balance Found.');
      }

      await this.sellerWithdrawalService.activateSellerWithdrawal(Number(sellerWithdrawal.id));

      return { message: 'Activated Seller Balance Successfully.' };
    } catch (e) {
      if (e.response.message === 'No Seller Balance Found.') {
        throw new BadRequestException('No Seller Balance Found.');
      }
      throw new UnauthorizedException();
    }
  }
}
