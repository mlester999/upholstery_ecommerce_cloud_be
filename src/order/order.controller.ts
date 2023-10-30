import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import * as Paymongo from 'paymongo';

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

  @Post('show-payment-page')
  async showPaymentPage(@Body() body: any) {
    const paymongo = new Paymongo(process.env.SECRET_KEY);

    let productDescription = 'Payment for ';

    // Loop through the array and build the description
    body.details.product_list.forEach((product, index) => {
      productDescription += `${product.quantity} pc${
        product.quantity > 1 ? 's' : ''
      } of ${product.name}`;
      if (index < body.details.product_list.length - 1) {
        productDescription += ', ';
      }
    });

    const paymentData = {
      data: {
        attributes: {
          amount: Number(body.details.subtotal_price) * 100,
          description: productDescription,
          remarks: 'For testings lang',
        },
      },
    };

    // const webhookData = {
    //   data: {
    //     attributes: {
    //       url: 'https://de47-136-158-78-172.ngrok-free.app/api/paymongo-webhook',
    //       events: [
    //         'source.chargeable',
    //         'payment.failed',
    //         'payment.paid',
    //         'link.payment.paid',
    //       ],
    //     },
    //   },
    // };

    const linksResult = await paymongo.links.create(paymentData);

    // const createWebHooksResult = await paymongo.webhooks.create(webhookData);

    return linksResult;
  }

  @Post('finishedPayment')
  @HttpCode(HttpStatus.OK)
  async finishedPayment(@Req() req) {
    if (req.method === 'POST') {
      try {
        const body = req.body;
        console.log('=== Webhook triggered ===');
        console.log(body.data);
        console.log('=== Webhook end ===');
        return { message: 'Webhook Received' };
      } catch (error) {
        console.error('Error handling webhook:', error);
        return { message: 'Internal Server Error' };
      }
    } else {
      return { message: 'Method Not Allowed' };
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

      await this.productService.decreaseProductQuantity(
        body.details.product_id,
        body.details.quantity,
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
