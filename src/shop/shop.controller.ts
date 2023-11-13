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
import { SellerService } from 'src/seller/seller.service';
import { ShopService } from './shop.service';
import { ActivityLogService } from 'src/activity-log/activity-log.service';

@Controller('shop')
export class ShopController {
  constructor(
    private readonly shopService: ShopService,
    private readonly sellerService: SellerService,
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

      return this.shopService.findAllShop();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get(':shop_id')
  async findOne(@Req() request, @Param('shop_id') shopId) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      return this.shopService.findById(parseInt(shopId));
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get('/slug/:shop_slug')
  async findOneBySlug(@Req() request, @Param('shop_slug') shopSlug) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      return this.shopService.findBySlug(shopSlug);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('add')
  async addShop(@Body() body: any, @Req() request, @Ip() ip) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      if (Object.keys(body.details).length === 0) return;

      const seller = await this.sellerService.findById(body.details.seller_id);

      if (!seller) {
        throw new BadRequestException('No Seller Found.');
      }

      const hasExistingShop = await this.shopService.findBySellerId(seller.id);

      if (hasExistingShop) {
        throw new BadRequestException(
          'Seller has already existing shop. You can deactivate the existing shop and create a new one.',
        );
      }

      const createdShop = await this.shopService.createShop(body.details, seller);

      await this.activityLogService.createActivityLog({title: 'create-shop', description: `A new shop named ${createdShop.name} was created by ${createdShop.seller.first_name} ${createdShop.seller.last_name}`, ip_address: ip});

      return { message: 'Created Shop Successfully.' };
    } catch (e) {
      if (
        e.response.message ===
        'Seller has already existing shop. You can deactivate the existing shop and create a new one.'
      ) {
        throw new BadRequestException(
          'Seller has already existing shop. You can deactivate the existing shop and create a new one.',
        );
      }
      throw new UnauthorizedException();
    }
  }

  @Patch('update/:shop_id')
  async updateShop(
    @Body() body: any,
    @Param('shop_id') shopId,
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

      let seller;
      const shop = await this.shopService.findById(shopId);

      if (body.details.seller_id) {
        seller = await this.sellerService.findById(body.details.seller_id);

        if (!seller) {
          throw new BadRequestException('No Seller Found.');
        }

        const hasExistingShop = await this.shopService.findBySellerId(
          seller.id,
        );

        if (hasExistingShop && seller.id !== shop.seller.id) {
          throw new BadRequestException(
            'Seller has already existing shop. You can deactivate the existing shop and create a new one.',
          );
        }
      }

      if (!shop) {
        throw new BadRequestException('No Shop Found.');
      }

      const updatedShop = await this.shopService.updateShop(body, parseInt(shopId), seller);

      await this.activityLogService.createActivityLog({title: 'update-shop', description: `A shop named ${updatedShop.name} has been updated by ${updatedShop.seller.first_name} ${updatedShop.seller.last_name}`, ip_address: ip});

      return { message: 'Updated shop details successfully.' };
    } catch (e) {
      if (
        e.response.message ===
        'Seller has already existing shop. You can deactivate the existing shop and create a new one.'
      ) {
        throw new BadRequestException(
          'Seller has already existing shop. You can deactivate the existing shop and create a new one.',
        );
      }
      throw new UnauthorizedException();
    }
  }

  @Patch('deactivate/:shop_id')
  async deactivateShop(@Param('shop_id') shopId, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const shop = await this.shopService.findById(shopId);

      if (!shop) {
        throw new BadRequestException('No Shop Found.');
      }

      await this.shopService.deactivateShop(shop.id);

      return { message: 'Deactivated shop successfully.' };
    } catch (e) {
      if (e.response.message === 'No Shop Found.') {
        throw new BadRequestException('No Shop Found.');
      }
      throw new UnauthorizedException();
    }
  }

  @Patch('activate/:shop_id')
  async activateShop(@Param('shop_id') shopId, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const shop = await this.shopService.findById(shopId);

      if (!shop) {
        throw new BadRequestException('No Shop Found.');
      }

      await this.shopService.activateShop(shop.id);

      return { message: 'Activated shop successfully.' };
    } catch (e) {
      if (e.response.message === 'No Shop Found.') {
        throw new BadRequestException('No Shop Found.');
      }
      throw new UnauthorizedException();
    }
  }
}
