import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UnauthorizedException, UseInterceptors, UploadedFile, Ip, BadRequestException } from '@nestjs/common';
import { ReturnRefundService } from './return-refund.service';
import { CreateReturnRefundDto } from './dto/create-return-refund.dto';
import { UpdateReturnRefundDto } from './dto/update-return-refund.dto';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedMulterFileI } from 'src/spaces-module/spaces-service';
import { ActivityLogService } from 'src/activity-log/activity-log.service';
import { DoSpacesService } from 'src/spaces-module/spaces-service/doSpacesService';
import { OrderService } from 'src/order/order.service';
import { ProductService } from 'src/product/product.service';
import { randomUuid } from '../../utils/generateUuid';
import { CustomerService } from 'src/customer/customer.service';
import { Product } from 'src/product/entities/product.entity';

@Controller('return-refund')
export class ReturnRefundController {
  constructor(private readonly returnRefundService: ReturnRefundService,
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
    private readonly customerService: CustomerService,
    private readonly activityLogService: ActivityLogService,
    private readonly jwtService: JwtService,
    private readonly doSpacesService: DoSpacesService) {}

  @Get('all')
  async findAll(@Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      return this.returnRefundService.findAllReturnRefund();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get(':return_refund_id')
  async findOne(@Req() request, @Param('return_refund_id') returnRefundId) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      return this.returnRefundService.findById(parseInt(returnRefundId));
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
  
  @Get('/slug/:return_refund_slug')
  async findOneBySlug(@Req() request, @Param('return_refund_slug') returnRefundSlug) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      console.log(returnRefundSlug);

      return this.returnRefundService.findBySlug(returnRefundSlug);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('add')
  @UseInterceptors(FileInterceptor('image_file'))
  async addProduct(
    @Body() body: any,
    @Req() request,
    @UploadedFile() file: UploadedMulterFileI,
    @Ip() ip
  ) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const details = JSON.parse(body.details);

      if (Object.keys(details).length <= 1) return;

      const uploadedUrl = await this.doSpacesService.uploadFile(
        file,
        details.shop_id,
        'returns',
      );

      const order = await this.orderService.findById(details.order_id);

      if (!order) {
        throw new BadRequestException('No Order Found.');
      }

      const customer = await this.customerService.findById(details.customer_id);

      if (!customer) {
        throw new BadRequestException('No Customer Found.');
      }

      const orderedProduct: Product = await new Promise((resolve, reject) => {
        const product = JSON.parse(order.products).find((p) => p.id == details.product_id);
        if (product) {
          resolve(product);
        } else {
          reject(new Error('Product not found'));
        }
      });

      const randomReturnRefundId = randomUuid(14, 'ALPHANUM');

      const returnRefundDetails = {...details, order_id: order.order_id}

      const createdReturnRefund = await this.returnRefundService.createReturnRefund(
        returnRefundDetails,
        customer,
        orderedProduct,
        randomReturnRefundId,
        uploadedUrl,
      );

      await this.activityLogService.createActivityLog({title: 'create-return-refund', description: `A new return/refund was requested from ${customer.first_name} ${customer.last_name}. The item is ${orderedProduct.name} from shop named ${orderedProduct.shop.name}.`, ip_address: ip});

      return { message: 'Return/Refund Requested Successfully.' };
    } catch (e) {
        console.log(e);
        throw new UnauthorizedException();
    }
  }

  @Patch('update-status/:return_refund_id')
  async updateStatus(
    @Body() body: any,
    @Param('return_refund_id') returnRefundId,
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

      const updatedShop: any = await this.returnRefundService.updateReturnRefundStatus(body.details, parseInt(returnRefundId));

      await this.activityLogService.createActivityLog({title: 'update-return-refund-status', description: `A seller named ${updatedShop.product.shop.seller.first_name} ${updatedShop.product.shop.seller.last_name} updated the return/refund status of an order of ${updatedShop.customer.first_name} ${updatedShop.customer.last_name}. The return refund id is: ${updatedShop.return_refund_id}.`, ip_address: ip});

      return { message: 'Updated return refund status successfully.' };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  // @Patch('update/:product_id')
  // @UseInterceptors(FileInterceptor('image_file'))
  // async updateReturnRefund(
  //   @Body() body: any,
  //   @Param('product_id') productId,
  //   @Req() request,
  //   @UploadedFile() file: UploadedMulterFileI,
  //   @Ip() ip
  // ) {
  //   try {
  //     const cookie = request.cookies['user_token'];

  //     const data = await this.jwtService.verifyAsync(cookie);

  //     if (!data) {
  //       throw new UnauthorizedException();
  //     }

  //     const details = JSON.parse(body.details);

  //     if (Object.keys(details).length <= 1) return;

  //     let category;
  //     let shop;

  //     if (details.category_id) {
  //       category = await this.categoryService.findById(details.category_id);

  //       if (!category) {
  //         throw new BadRequestException('No Category Found.');
  //       }
  //     }

  //     if (details.shop_id) {
  //       shop = await this.shopService.findById(details.shop_id);

  //       if (!shop) {
  //         throw new BadRequestException('No Shop Found.');
  //       }
  //     }

  //     const product = await this.productService.findById(productId);

  //     if (!product) {
  //       throw new BadRequestException('No Product Found.');
  //     }

  //     let uploadedUrl;

  //     if (details.image_file) {
  //       await this.doSpacesService.removeFile(
  //         `products/${product.shop.id}/${product.image_name}`,
  //       );

  //       if (details.shop_id) {
  //         uploadedUrl = await this.doSpacesService.uploadFile(
  //           file,
  //           details.shop_id,
  //           'products',
  //         );
  //       } else {
  //         uploadedUrl = await this.doSpacesService.uploadFile(
  //           file,
  //           product.shop.id,
  //           'products',
  //         );
  //       }
  //     } else if (details.shop_id) {
  //       uploadedUrl = await this.doSpacesService.renameFolder(
  //         'products',
  //         product.shop.id,
  //         details.shop_id,
  //         product.image_name,
  //       );
  //     }

  //     const updatedProduct = await this.productService.updateProduct(
  //       details,
  //       uploadedUrl,
  //       parseInt(productId),
  //       category,
  //       shop,
  //     );

  //     await this.activityLogService.createActivityLog({title: 'update-product', description: `A product named ${updatedProduct.name} was updated by ${updatedProduct.shop.seller.first_name} ${updatedProduct.shop.seller.last_name} in its shop named ${updatedProduct.shop.name}`, ip_address: ip});

  //     return { message: 'Updated product details successfully.' };
  //   } catch (e) {
  //     throw new UnauthorizedException();
  //   }
  // }
}
