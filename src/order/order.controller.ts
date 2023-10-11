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
import { CustomerService } from 'src/customer/customer.service';
import { ProductService } from 'src/product/product.service';
import { SellerService } from 'src/seller/seller.service';
import { OrderService } from './order.service';

@Controller('Order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly customerService: CustomerService,
    private readonly sellerService: SellerService,
    private readonly productService: ProductService,
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

      return this.orderService.findAllOrder();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get(':order_id')
  async findOne(@Req() request, @Param('order_id') orderId) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      return this.orderService.findById(parseInt(orderId));
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('add')
  async addOrder(@Body() body: any, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      if (Object.keys(body.details).length === 0) return;

      const customer = await this.customerService.findById(
        body.details.customer_id,
      );

      if (!customer) {
        throw new BadRequestException('No Customer Found.');
      }

      const seller = await this.sellerService.findById(body.details.seller_id);

      if (!seller) {
        throw new BadRequestException('No Seller Found.');
      }

      const product = await this.productService.findById(
        body.details.product_id,
      );

      if (!product) {
        throw new BadRequestException('No Product Found.');
      }

      await this.orderService.createOrder(
        body.details,
        customer,
        seller,
        product,
      );

      return { message: 'Created Order Successfully.' };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Patch('update/:order_id')
  async updateOrder(
    @Body() body: any,
    @Param('order_id') orderId,
    @Req() request,
  ) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      if (Object.keys(body.details).length <= 1) return;

      let customer;
      let seller;
      let product;

      if (body.details.customer_id) {
        customer = await this.customerService.findById(
          body.details.customer_id,
        );

        if (!customer) {
          throw new BadRequestException('No Customer Found.');
        }
      }

      if (body.details.seller_id) {
        seller = await this.sellerService.findById(body.details.seller_id);

        if (!seller) {
          throw new BadRequestException('No Seller Found.');
        }
      }

      if (body.details.product_id) {
        product = await this.productService.findById(body.details.product_id);

        if (!product) {
          throw new BadRequestException('No Product Found.');
        }
      }

      const order = await this.orderService.findById(orderId);

      if (!order) {
        throw new BadRequestException('No Order Found.');
      }

      await this.orderService.updateOrder(
        body.details,
        parseInt(orderId),
        customer,
        seller,
        product,
      );

      return { message: 'Updated order details successfully.' };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Patch('deactivate/:order_id')
  async deactivateOrder(@Param('order_id') orderId, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const order = await this.orderService.findById(orderId);

      if (!order) {
        throw new BadRequestException('No Order Found.');
      }

      await this.orderService.deactivateOrder(order.id);

      return { message: 'Deactivated order successfully.' };
    } catch (e) {
      if (e.response.message === 'No Order Found.') {
        throw new BadRequestException('No Order Found.');
      }
      throw new UnauthorizedException();
    }
  }

  @Patch('activate/:order_id')
  async activateCategory(@Param('order_id') orderId, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const order = await this.orderService.findById(orderId);

      if (!order) {
        throw new BadRequestException('No Order Found.');
      }

      await this.orderService.activateOrder(order.id);

      return { message: 'Activated order successfully.' };
    } catch (e) {
      if (e.response.message === 'No Order Found.') {
        throw new BadRequestException('No Order Found.');
      }
      throw new UnauthorizedException();
    }
  }
}
