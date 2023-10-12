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
import { ShopService } from 'src/shop/shop.service';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly customerService: CustomerService,
    private readonly shopService: ShopService,
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

      const shop = await this.shopService.findById(body.details.shop_id);

      if (!shop) {
        throw new BadRequestException('No Shop Found.');
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
        shop,
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
      let shop;
      let product;

      if (body.details.customer_id) {
        customer = await this.customerService.findById(
          body.details.customer_id,
        );

        if (!customer) {
          throw new BadRequestException('No Customer Found.');
        }
      }

      if (body.details.shop_id) {
        shop = await this.shopService.findById(body.details.shop_id);

        if (!shop) {
          throw new BadRequestException('No Shop Found.');
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
        shop,
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
  async activateOrder(@Param('order_id') orderId, @Req() request) {
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
