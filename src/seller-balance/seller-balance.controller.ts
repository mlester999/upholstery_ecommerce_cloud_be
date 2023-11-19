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
import { SellerBalanceService } from './seller-balance.service';
import { ProductService } from 'src/product/product.service';
import { ShopService } from 'src/shop/shop.service';
import { randomUuid } from '../../utils/generateUuid';

@Controller('seller-balance')
export class SellerBalanceController {
  constructor(
    private readonly sellerBalanceService: SellerBalanceService,
    private readonly shopService: ShopService,
    private readonly productService: ProductService,
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

      return this.sellerBalanceService.findAllSellerBalance();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get(':seller_balance_id')
  async findOne(@Req() request, @Param('seller_balance_id') sellerBalanceId) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      return this.sellerBalanceService.findById(Number(sellerBalanceId));
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('add')
  async addSellerBalance(@Body() body: any, @Req() request, @Ip() ip) {
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

      const product = await this.productService.findById(Number(body.details.product_id));

      if (!product) {
        throw new BadRequestException('No Product Found.');
      }

      const sellerBalanceId = randomUuid(14, 'ALPHANUM');

      const createdSellerBalance = await this.sellerBalanceService.createSellerBalance(body.details, sellerBalanceId, body.details.order_id, shop, product);

      await this.activityLogService.createActivityLog({title: 'add-seller-balance', description: `A shop named ${createdSellerBalance.shop.name} has a pending seller balance from a customer's order.`, ip_address: ip});

      return { message: 'Added Seller Balance Successfully.' };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Patch('update/:seller_balance_id')
  async updateSellerBalance(
    @Body() body: any,
    @Param('seller_balance_id') sellerBalanceId,
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

     
      const sellerBalance = await this.sellerBalanceService.findById(sellerBalanceId);

      if (!sellerBalance) {
        throw new BadRequestException('No Seller Balance Found.');
      }

      let shop;
      let product;

      if(body.details.shop_id) {
        shop = await this.shopService.findById(body.details.shop_id);

        if (!shop) {
          throw new BadRequestException('No Seller Found.');
        }
      }

      if(body.details.product_id) {
       product = await this.productService.findById(body.details.product_id);

        if (!product) {
          throw new BadRequestException('No Product Found.');
        }
      }

      const updatedSellerBalance = await this.sellerBalanceService.updateSellerBalance(body, sellerBalanceId, shop, product);

      await this.activityLogService.createActivityLog({title: 'update-seller-balance', description: `A shop named ${updatedSellerBalance.shop.name} has an update to its pending seller balance from a customer's order.`, ip_address: ip});

      return { message: 'Updated Seller Balance Successfully.' };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Patch('deactivate/:seller_balance_id')
  async deactivateSellerBalance(@Param('seller_balance_id') sellerBalanceId, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const sellerBalance = await this.sellerBalanceService.findById(Number(sellerBalanceId));

      if (!sellerBalance) {
        throw new BadRequestException('No Seller Balance Found.');
      }

      await this.sellerBalanceService.deactivateSellerBalance(Number(sellerBalance.id));

      return { message: 'Deactivated Seller Balance Successfully.' };
    } catch (e) {
      if (e.response.message === 'No Seller Balance Found.') {
        throw new BadRequestException('No Seller Balance Found.');
      }
      throw new UnauthorizedException();
    }
  }

  @Patch('activate/:seller_balance_id')
  async activateSellerBalance(@Param('seller_balance_id') sellerBalanceId, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const sellerBalance = await this.sellerBalanceService.findById(Number(sellerBalanceId));

      if (!sellerBalance) {
        throw new BadRequestException('No Seller Balance Found.');
      }

      await this.sellerBalanceService.activateSellerBalance(Number(sellerBalance.id));

      return { message: 'Activated Seller Balance Successfully.' };
    } catch (e) {
      if (e.response.message === 'No Seller Balance Found.') {
        throw new BadRequestException('No Seller Balance Found.');
      }
      throw new UnauthorizedException();
    }
  }
}
