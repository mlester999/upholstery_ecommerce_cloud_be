import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
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
import { randomUuid } from '../../utils/generateUuid';
import { ActiveType } from 'src/user/entities/user.entity';
import { ActivityLogService } from 'src/activity-log/activity-log.service';
import { OrderReceivedType } from './entities/order.entity';
import { SellerBalanceService } from 'src/seller-balance/seller-balance.service';
import { SellerBalanceStatusType } from 'src/seller-balance/entities/seller-balance.entity';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly customerService: CustomerService,
    private readonly shopService: ShopService,
    private readonly productService: ProductService,
    private readonly sellerBalanceService: SellerBalanceService,
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

  @Post('add')
  async addOrder(@Body() body: any, @Req() request, @Ip() ip) {
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

      let totalPrice = 0;
      let totalQuantity = 0;

      const orderedProducts = await Promise.all(
        body.details.products.map(async (el, index) => {
          const product = await this.productService.findById(Number(el));

          if (!product) {
            throw new BadRequestException('No Product Found.');
          }

          const shop = await this.shopService.findById(Number(el.shop_id));

          if (!shop) {
            throw new BadRequestException('No Shop Found.');
          }

          const orderedProduct = {
            ...product,
            price: product.price * Number(body.details.quantity[index]),
            quantity: Number(body.details.quantity[index]),
            status: 'Processing',
          };

          totalPrice += orderedProduct.price;
          totalQuantity += orderedProduct.quantity;

          const details = {amount: orderedProduct.price, status: SellerBalanceStatusType.Pending, is_active: ActiveType.Active}

          const sellerBalanceId = randomUuid(14, 'ALPHANUM');

          await this.sellerBalanceService.createSellerBalance(details, sellerBalanceId, shop, product);

          await this.productService.decreaseProductQuantity(
            Number(el),
            body.details.quantity[index],
          );

          return orderedProduct;
        }),
      );

      if (orderedProducts.length === 0) {
        throw new BadRequestException('No Products Found.');
      }

      const randomOrderId = randomUuid(14, 'ALPHANUM');

      const orderDetails = {
        order_id: randomOrderId,
        source_id: null,
        payment_method: 'Cash on Delivery',
        total_quantity: totalQuantity,
        shipping_fee: 39,
        subtotal_price: totalPrice,
        total_price: totalPrice + 39,
        voucher_code: null,
        price_discount: null,
        shipping_discount: null,
        discount_mode: null,
        order_received: OrderReceivedType.OrderPending,
        is_active: ActiveType.Active,
      };

      const createdOrder = await this.orderService.createOrder(
        orderDetails,
        customer,
        JSON.stringify(orderedProducts),
        randomOrderId,
      );

      await this.activityLogService.createActivityLog({title: 'customer-order', description: `A customer named ${createdOrder.customer.first_name} ${createdOrder.customer.last_name} ordered in our e-commerce website with the total quantity of ${createdOrder.total_quantity} and a total price of ₱${createdOrder.total_price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
      })}, the order id is ${createdOrder.order_id}`, ip_address: ip});

      return { message: 'Created Order Successfully.' };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('customer-order')
  async customerOrder(@Body() body: any, @Req() request, @Ip() ip) {
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

      let totalPrice = 0;
      let totalQuantity = 0;

  

      const orderedProducts = await Promise.all(
        body.details.product_list.map(async (el, index) => {
          const product = await this.productService.findById(Number(el.id));

          if (!product) {
            throw new BadRequestException('No Product Found.');
          }

          const shop = await this.shopService.findById(Number(el.shop.id));

          if (!shop) {
            throw new BadRequestException('No Shop Found.');
          }

          const orderedProduct = {
            ...product,
            price: product.price * Number(el.quantity),
            quantity: Number(el.quantity),
            status: 'Processing',
          };

          totalPrice += orderedProduct.price;
          totalQuantity += orderedProduct.quantity;

          const sellerBalanceId = randomUuid(14, 'ALPHANUM');

          const details = {amount: orderedProduct.price, status: SellerBalanceStatusType.Pending, is_active: ActiveType.Active}

          await this.sellerBalanceService.createSellerBalance(details, sellerBalanceId, shop, product);

          await this.productService.decreaseProductQuantity(
            Number(el.id),
            el.quantity,
          );

          return orderedProduct;
        }),
      );

      if (orderedProducts.length === 0) {
        throw new BadRequestException('No Products Found.');
      }

      const randomOrderId = randomUuid(14, 'ALPHANUM');

      const orderDetails = {
        order_id: randomOrderId,
        source_id: body.details.source_id ?? null,
        payment_method: body.details.payment_method,
        total_quantity: body.details.total_quantity,
        shipping_fee: body.details.shipping_fee,
        subtotal_price: body.details.subtotal_price,
        total_price: body.details.total_price,
        voucher_code: body.details.voucher_code,
        price_discount: body.details.price_discount,
        shipping_discount: body.details.shipping_discount,
        discount_mode: body.details.discount_mode,
        order_received: OrderReceivedType.OrderPending,
        is_active: ActiveType.Active,
      };

      // const products = [];

      // for (const el of body.details.product_list) {
      //   el.status = 'Processing';
      //   console.log(body.details.product_list);

      //   // await this.sellerBalanceService.createSellerBalance(details, shop, product);
      //   await this.productService.decreaseProductQuantity(el.id, el.quantity);

      //   products.push(el);
      // }

      const newlyCreatedOrder = await this.orderService.createOrder(
        orderDetails,
        customer,
        JSON.stringify(orderedProducts),
        randomOrderId,
      );

      await this.activityLogService.createActivityLog({title: 'customer-order', description: `A customer named ${newlyCreatedOrder.customer.first_name} ${newlyCreatedOrder.customer.last_name} ordered in our e-commerce website with the total quantity of ${newlyCreatedOrder.total_quantity} and a total price of ₱${newlyCreatedOrder.total_price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
      })}, the order id is ${newlyCreatedOrder.order_id}`, ip_address: ip});

      return {
        message: 'Created Order Successfully.',
        order_id: newlyCreatedOrder.order_id,
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Patch('order-received')
  async orderReceived(@Body() body: any, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

        const order = await this.orderService.findById(body.details.order_id);

        if (!order) {
          throw new BadRequestException('No Order Found.');
        }

        const orderedProducts = await Promise.all(
          JSON.parse(order.products).map(async (product, index) => {
            const originalProduct = await this.productService.findById(
              Number(product.id),
            );

            if (!originalProduct) {
              throw new BadRequestException('No Product Found.');
            }
            
            if (originalProduct.id == body.details.product_id) {
              const orderedProduct = {
                ...originalProduct,
                price: product.price,
                quantity: product.quantity,
                status: product.status,
                order_received: OrderReceivedType.OrderReceived
              };
  
              return orderedProduct;

            } else {
              const orderedProduct = {
                ...originalProduct,
                price: product.price,
                quantity: product.quantity,
                status: product.status,
                order_received: product.order_received ?? OrderReceivedType.OrderPending
              };
  
              return orderedProduct;
            }
          }),
        );

        if (orderedProducts.length === 0) {
          throw new BadRequestException('No Products Found.');
        }

        const orderDetails = {
          products: orderedProducts,
        };

        await this.orderService.updateOrder(orderDetails, parseInt(body.details.order_id));

      return {
        message: 'Order Received Successfully.'
      };
    } catch (e) {
      console.log(e);
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

      if (body.details.products) {
        const order = await this.orderService.findById(orderId);

        if (!order) {
          throw new BadRequestException('No Order Found.');
        }

        const orderedProducts = await Promise.all(
          JSON.parse(order.products).map(async (product, index) => {
            const originalProduct = await this.productService.findById(
              Number(body.details.products[index]),
            );

            if (!originalProduct) {
              throw new BadRequestException('No Product Found.');
            }

            const orderedProduct = {
              ...originalProduct,
              price: originalProduct.price * product.quantity,
              quantity: product.quantity,
              status: product.status,
            };

            return orderedProduct;
          }),
        );

        if (orderedProducts.length === 0) {
          throw new BadRequestException('No Products Found.');
        }

        const orderDetails = {
          products: orderedProducts,
        };

        await this.orderService.updateOrder(orderDetails, parseInt(orderId));
      }

      if (body.details.quantity) {
        let totalPrice = 0;
        let totalQuantity = 0;

        const order = await this.orderService.findById(orderId);

        if (!order) {
          throw new BadRequestException('No Order Found.');
        }

        const orderedProducts = await Promise.all(
          JSON.parse(order.products).map(async (product, index) => {
            const originalProduct = await this.productService.findById(
              Number(product.id),
            );
            const orderedQuantity = Number(body.details.quantity[index]);

            if (orderedQuantity < product.quantity) {
              const newQuantity = product.quantity - orderedQuantity;

              await this.productService.increaseProductQuantity(
                Number(product.id),
                newQuantity,
              );
            }

            if (orderedQuantity > product.quantity) {
              const newQuantity = orderedQuantity - product.quantity;

              await this.productService.decreaseProductQuantity(
                Number(product.id),
                newQuantity,
              );
            }

            const productQuantity = {
              ...product,
              price: originalProduct.price * orderedQuantity,
              quantity: orderedQuantity,
            };

            totalPrice += productQuantity.price;
            totalQuantity += productQuantity.quantity;

            return productQuantity;
          }),
        );

        if (orderedProducts.length === 0) {
          throw new BadRequestException('No Products Found.');
        }

        const orderDetails = {
          products: orderedProducts,
          total_quantity: totalQuantity,
          subtotal_price: totalPrice,
        };

        await this.orderService.updateOrder(orderDetails, parseInt(orderId));
      }

      if (body.details.status) {
        const order = await this.orderService.findById(orderId);

        if (!order) {
          throw new BadRequestException('No Order Found.');
        }

        const orderedProducts = await Promise.all(
          JSON.parse(order.products).map(async (product, index) => {
            const productStatus = {
              ...product,
              status: body.details.status[index],
            };

            return productStatus;
          }),
        );

        if (orderedProducts.length === 0) {
          throw new BadRequestException('No Products Found.');
        }

        const orderDetails = {
          products: orderedProducts,
        };

        await this.orderService.updateOrder(orderDetails, parseInt(orderId));
      }

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
