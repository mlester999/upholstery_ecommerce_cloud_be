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
import { ReviewService } from './review.service';
import { ShopService } from 'src/shop/shop.service';
import { ProductService } from 'src/product/product.service';
import { CustomerService } from 'src/customer/customer.service';

@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly shopService: ShopService,
    private readonly productService: ProductService,
    private readonly customerService: CustomerService,
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

      return this.reviewService.findAllReview();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get(':review_id')
  async findOne(@Req() request, @Param('review_id') reviewId) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      return this.reviewService.findById(Number(reviewId));
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('add')
  async addReview(@Body() body: any, @Req() request, @Ip() ip) {
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

      const customer = await this.customerService.findById(Number(body.details.customer_id));

      if (!customer) {
        throw new BadRequestException('No Customer Found.');
      }

      const reviewId = randomUuid(14, 'ALPHANUM');
      
      const createdReview = await this.reviewService.createReview(body.details, reviewId, body.details.order_id, shop, product, customer);

      await this.activityLogService.createActivityLog({title: 'add-customer-review', description: `A customer named ${createdReview.customer.first_name} ${createdReview.customer.last_name} has put a review to a product ${createdReview.product.name} from the shop ${createdReview.shop.name}. The order ID is ${createdReview.order_id}.`, ip_address: ip});

      return { message: 'Added Review Successfully.' };
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }

  @Patch('update/:review_id')
  async updateReview(
    @Body() body: any,
    @Param('review_id') reviewId,
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

     
      const review = await this.reviewService.findById(reviewId);

      if (!review) {
        throw new BadRequestException('No Review Found.');
      }

      let shop;
      let product;
      let customer;

      if(body.details.shop_id) {
        shop = await this.shopService.findById(body.details.shop_id);

        if (!shop) {
          throw new BadRequestException('No Shop Found.');
        }
      }

      if(body.details.product_id) {
        product = await this.productService.findById(body.details.product_id);

        if (!product) {
          throw new BadRequestException('No Product Found.');
        }
      }

      if(body.details.customer_id) {
        customer = await this.customerService.findById(body.details.customer_id);

        if (!customer) {
          throw new BadRequestException('No Customer Found.');
        }
      }

      const updatedReview = await this.reviewService.updateReview(body, reviewId, shop, product, customer);

      await this.activityLogService.createActivityLog({title: 'update-customer-review', description: `A customer named ${updatedReview.customer.first_name} ${updatedReview.customer.last_name} has an update to its review to a product ${updatedReview.product.name} from the shop ${updatedReview.shop.name}. The order ID is ${updatedReview.order_id}.`, ip_address: ip});

      return { message: 'Updated Review Successfully.' };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Patch('deactivate/:review_id')
  async deactivateReview(@Param('review_id') reviewId, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const review = await this.reviewService.findById(Number(reviewId));

      if (!review) {
        throw new BadRequestException('No Review Found.');
      }

      await this.reviewService.deactivateReview(Number(review.id));

      return { message: 'Deactivated Review Successfully.' };
    } catch (e) {
      if (e.response.message === 'No Review Found.') {
        throw new BadRequestException('No Review Found.');
      }
      throw new UnauthorizedException();
    }
  }

  @Patch('activate/:review_id')
  async activateReview(@Param('review_id') reviewId, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const review = await this.reviewService.findById(Number(reviewId));

      if (!review) {
        throw new BadRequestException('No Review Found.');
      }

      await this.reviewService.activateReview(Number(review.id));

      return { message: 'Activated Review Successfully.' };
    } catch (e) {
      if (e.response.message === 'No Review Found.') {
        throw new BadRequestException('No Review Found.');
      }
      throw new UnauthorizedException();
    }
  }
}
