import * as fs from 'fs';
import { Express } from 'express';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UnauthorizedException,
  UseInterceptors,
  Ip,
  UploadedFiles,
} from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { CategoryService } from 'src/category/category.service';
import { ShopService } from 'src/shop/shop.service';
import { ProductService } from './product.service';
import { DoSpacesService } from 'src/spaces-module/spaces-service/doSpacesService';
import { diskStorage } from 'multer';
import * as path from 'path';
import { UploadedMulterFileI } from 'src/spaces-module/spaces-service';
import { ActivityLogService } from 'src/activity-log/activity-log.service';
import { randomUuid } from '../../utils/generateUuid';
import { NotificationService } from 'src/notification/notification.service';
import { FollowService } from 'src/follow/follow.service';
import { ActiveType } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { SellerService } from 'src/seller/seller.service';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly shopService: ShopService,
    private readonly activityLogService: ActivityLogService,
    private readonly followService: FollowService,
    private readonly notificationService: NotificationService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly sellerService: SellerService,
    private readonly doSpacesService: DoSpacesService,
  ) {}

  @Get('all')
  async findAll(@Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      return await this.productService.findAllProduct();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get('latest-products')
  async findAllLatestProducts() {
    return await this.productService.findLatestProducts();
  }

  @Get(':product_id')
  async findOne(@Req() request, @Param('product_id') productId) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      return this.productService.findById(parseInt(productId));
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get('/slug/:productSlug')
  async findOneByProductSlug(
    @Req() request,
    @Param('productSlug') productSlug,
  ) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const userId = parseInt(data['user_id']);

      const user = await this.userService.findById(userId);

      const seller = await this.sellerService.findByEmail(user.email);

      return this.productService.findBySlug(productSlug, seller.id);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get('/slug/:shopSlug/:productSlug')
  async findOneByOrderId(
    @Req() request,
    @Param('shopSlug') shopSlug,
    @Param('productSlug') productSlug,
  ) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      console.log(productSlug);
      console.log(shopSlug);

      return this.productService.findBySlugAndShop(productSlug, shopSlug);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('add')
  @UseInterceptors(AnyFilesInterceptor())
  async addProduct(
    @Body() body: any,
    @Req() request,
    @UploadedFiles() files: UploadedMulterFileI[],
    @Ip() ip,
  ) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const details = JSON.parse(body.details);

      if (Object.keys(details).length <= 1) return;

      const category = await this.categoryService.findById(details.category_id);

      if (!category) {
        throw new BadRequestException('No Category Found.');
      }

      const shop = await this.shopService.findById(details.shop_id);

      if (!shop) {
        throw new BadRequestException('No Shop Found.');
      }

      const uploadedImageUrl = await this.doSpacesService.uploadFile(
        files[0],
        details.shop_id,
        'products',
      );

      let uploadedImageUrl2;

      if (details.image_file_2) {
        uploadedImageUrl2 = await this.doSpacesService.uploadFile(
          files.find((el) => el.fieldname === 'image_file_2'),
          details.shop_id,
          'products',
        );
      }

      let uploadedImageUrl3;

      if (details.image_file_3) {
        uploadedImageUrl3 = await this.doSpacesService.uploadFile(
          files.find((el) => el.fieldname === 'image_file_3'),
          details.shop_id,
          'products',
        );
      }

      let uploadedImageUrl4;

      if (details.image_file_4) {
        uploadedImageUrl4 = await this.doSpacesService.uploadFile(
          files.find((el) => el.fieldname === 'image_file_4'),
          details.shop_id,
          'products',
        );
      }

      let uploadedImageUrl5;

      if (details.image_file_5) {
        uploadedImageUrl5 = await this.doSpacesService.uploadFile(
          files.find((el) => el.fieldname === 'image_file_5'),
          details.shop_id,
          'products',
        );
      }

      let uploadedImageUrl6;

      if (details.image_file_6) {
        uploadedImageUrl6 = await this.doSpacesService.uploadFile(
          files.find((el) => el.fieldname === 'image_file_6'),
          details.shop_id,
          'products',
        );
      }

      let uploadedImageUrl7;

      if (details.image_file_7) {
        uploadedImageUrl7 = await this.doSpacesService.uploadFile(
          files.find((el) => el.fieldname === 'image_file_7'),
          details.shop_id,
          'products',
        );
      }

      let uploadedImageUrl8;

      if (details.image_file_8) {
        uploadedImageUrl8 = await this.doSpacesService.uploadFile(
          files.find((el) => el.fieldname === 'image_file_8'),
          details.shop_id,
          'products',
        );
      }

      let uploadedImageUrl9;

      if (details.image_file_9) {
        uploadedImageUrl9 = await this.doSpacesService.uploadFile(
          files.find((el) => el.fieldname === 'image_file_9'),
          details.shop_id,
          'products',
        );
      }

      let uploadedVideo;

      if (details.video_file) {
        uploadedVideo = await this.doSpacesService.uploadFile(
          files.find((el) => el.fieldname === 'video_file'),
          details.shop_id,
          'products',
        );
      }

      const createdProduct = await this.productService.createProduct(
        details,
        category,
        shop,
        uploadedImageUrl,
        uploadedImageUrl2,
        uploadedImageUrl3,
        uploadedImageUrl4,
        uploadedImageUrl5,
        uploadedImageUrl6,
        uploadedImageUrl7,
        uploadedImageUrl8,
        uploadedImageUrl9,
        uploadedVideo,
      );

      const shopFollowers = await this.followService.findByShopId(shop.id);

      // Using the map function to iterate over the array
      const notifications = await Promise.all(
        shopFollowers.map(async (notification) => {
          const notificationId = randomUuid(14, 'ALPHANUM');
          const message = {
            title: `🌟 A new product was added in our shop! 🛒`,
            description: `✨ Dive into the latest addition of ${createdProduct.name} and elevate your shopping experience. Hurry, it's fresh off the shelves! 🚀`,
            is_active: ActiveType.Active,
          };
          const createdNotification =
            await this.notificationService.createNotification(
              message,
              notificationId,
              notification.shop,
              notification.customer,
            );
          return createdNotification;
        }),
      );

      await this.activityLogService.createActivityLog({
        title: 'create-product',
        description: `A new product named ${createdProduct.name} was created by ${createdProduct.shop.seller.first_name} ${createdProduct.shop.seller.last_name} in its shop named ${createdProduct.shop.name}`,
        ip_address: ip,
      });

      return { message: 'Created Product Successfully.' };
    } catch (e) {
      if (e.response?.message === 'No Category Found.') {
        throw new BadRequestException('No Category Found.');
      } else if (e.response?.message === 'No Shop Found.') {
        throw new BadRequestException('No Shop Found.');
      } else {
        throw new UnauthorizedException();
      }
    }
  }

  @Patch('update/:product_id')
  @UseInterceptors(AnyFilesInterceptor())
  async updateProduct(
    @Body() body: any,
    @Param('product_id') productId,
    @Req() request,
    @UploadedFiles() files: UploadedMulterFileI[],
    @Ip() ip,
  ) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const details = JSON.parse(body.details);

      if (Object.keys(details).length <= 1) return;

      let category;
      let shop;

      if (details.category_id) {
        category = await this.categoryService.findById(details.category_id);

        if (!category) {
          throw new BadRequestException('No Category Found.');
        }
      }

      if (details.shop_id) {
        shop = await this.shopService.findById(details.shop_id);

        if (!shop) {
          throw new BadRequestException('No Shop Found.');
        }
      }

      const product = await this.productService.findById(productId);

      if (!product) {
        throw new BadRequestException('No Product Found.');
      }

      let uploadedImageUrl;
      let uploadedVideoUrl;

      if (details.image_file && details.video_file) {
        await this.doSpacesService.removeFile(
          `products/${product.shop.id}/${product.image_name}`,
        );

        if (product.video_name) {
          await this.doSpacesService.removeFile(
            `products/${product.shop.id}/${product.video_name}`,
          );
        }

        if (details.shop_id) {
          uploadedImageUrl = await this.doSpacesService.uploadFile(
            files[0],
            details.shop_id,
            'products',
          );

          if (details.video_file) {
            uploadedVideoUrl = await this.doSpacesService.uploadFile(
              files.find((el) => el.fieldname === 'video_file'),
              details.shop_id,
              'products',
            );
          }
        } else {
          uploadedImageUrl = await this.doSpacesService.uploadFile(
            files[0],
            product.shop.id,
            'products',
          );

          if (details.video_file) {
            uploadedVideoUrl = await this.doSpacesService.uploadFile(
              files.find((el) => el.fieldname === 'video_file'),
              details.shop_id,
              'products',
            );
          }
        }
      } else if (details.image_file) {
        await this.doSpacesService.removeFile(
          `products/${product.shop.id}/${product.image_name}`,
        );

        if (details.shop_id) {
          uploadedImageUrl = await this.doSpacesService.uploadFile(
            files[0],
            details.shop_id,
            'products',
          );
        } else {
          uploadedImageUrl = await this.doSpacesService.uploadFile(
            files[0],
            product.shop.id,
            'products',
          );
        }
      } else if (details.video_file) {
        if (product.video_name) {
          await this.doSpacesService.removeFile(
            `products/${product.shop.id}/${product.video_name}`,
          );
        }

        if (details.shop_id) {
          if (details.video_file) {
            uploadedVideoUrl = await this.doSpacesService.uploadFile(
              files.find((el) => el.fieldname === 'video_file'),
              details.shop_id,
              'products',
            );
          }
        } else {
          if (details.video_file) {
            uploadedVideoUrl = await this.doSpacesService.uploadFile(
              files.find((el) => el.fieldname === 'video_file'),
              details.shop_id,
              'products',
            );
          }
        }
      } else if (details.shop_id) {
        // PENDING, NOT YET OKAY
        uploadedImageUrl = await this.doSpacesService.renameFolder(
          'products',
          product.shop.id,
          details.shop_id,
          product.image_name,
        );

        if (product.image_name_2) {
          await this.doSpacesService.renameFolder(
            'products',
            product.shop.id,
            details.shop_id,
            product.image_name_2,
          );
        }

        if (product.image_name_3) {
          await this.doSpacesService.renameFolder(
            'products',
            product.shop.id,
            details.shop_id,
            product.image_name_3,
          );
        }

        if (product.image_name_4) {
          await this.doSpacesService.renameFolder(
            'products',
            product.shop.id,
            details.shop_id,
            product.image_name_4,
          );
        }

        if (product.image_name_5) {
          await this.doSpacesService.renameFolder(
            'products',
            product.shop.id,
            details.shop_id,
            product.image_name_5,
          );
        }

        if (product.image_name_6) {
          await this.doSpacesService.renameFolder(
            'products',
            product.shop.id,
            details.shop_id,
            product.image_name_6,
          );
        }

        if (product.image_name_7) {
          await this.doSpacesService.renameFolder(
            'products',
            product.shop.id,
            details.shop_id,
            product.image_name_7,
          );
        }

        if (product.image_name_8) {
          await this.doSpacesService.renameFolder(
            'products',
            product.shop.id,
            details.shop_id,
            product.image_name_8,
          );
        }

        if (product.image_name_9) {
          await this.doSpacesService.renameFolder(
            'products',
            product.shop.id,
            details.shop_id,
            product.image_name_9,
          );
        }

        if (product.video_name) {
          uploadedVideoUrl = await this.doSpacesService.renameFolder(
            'products',
            product.shop.id,
            details.shop_id,
            product.video_name,
          );
        }
      }

      let uploadedImageUrl2;

      if (details.image_file_2) {
        await this.doSpacesService.removeFile(
          `products/${product.shop.id}/${product.image_name_2}`,
        );

        if (details.shop_id) {
          uploadedImageUrl2 = await this.doSpacesService.uploadFile(
            files.find((el) => el.fieldname === 'image_file_2'),
            details.shop_id,
            'products',
          );
        } else {
          uploadedImageUrl2 = await this.doSpacesService.uploadFile(
            files.find((el) => el.fieldname === 'image_file_2'),
            product.shop.id,
            'products',
          );
        }
      }

      let uploadedImageUrl3;

      if (details.image_file_3) {
        await this.doSpacesService.removeFile(
          `products/${product.shop.id}/${product.image_name_3}`,
        );

        if (details.shop_id) {
          uploadedImageUrl3 = await this.doSpacesService.uploadFile(
            files.find((el) => el.fieldname === 'image_file_3'),
            details.shop_id,
            'products',
          );
        } else {
          uploadedImageUrl3 = await this.doSpacesService.uploadFile(
            files.find((el) => el.fieldname === 'image_file_3'),
            product.shop.id,
            'products',
          );
        }
      }

      let uploadedImageUrl4;

      if (details.image_file_4) {
        await this.doSpacesService.removeFile(
          `products/${product.shop.id}/${product.image_name_4}`,
        );

        if (details.shop_id) {
          uploadedImageUrl4 = await this.doSpacesService.uploadFile(
            files.find((el) => el.fieldname === 'image_file_4'),
            details.shop_id,
            'products',
          );
        } else {
          uploadedImageUrl4 = await this.doSpacesService.uploadFile(
            files.find((el) => el.fieldname === 'image_file_4'),
            product.shop.id,
            'products',
          );
        }
      }

      let uploadedImageUrl5;

      if (details.image_file_5) {
        await this.doSpacesService.removeFile(
          `products/${product.shop.id}/${product.image_name_5}`,
        );

        if (details.shop_id) {
          uploadedImageUrl5 = await this.doSpacesService.uploadFile(
            files.find((el) => el.fieldname === 'image_file_5'),
            details.shop_id,
            'products',
          );
        } else {
          uploadedImageUrl5 = await this.doSpacesService.uploadFile(
            files.find((el) => el.fieldname === 'image_file_5'),
            product.shop.id,
            'products',
          );
        }
      }

      let uploadedImageUrl6;

      if (details.image_file_6) {
        await this.doSpacesService.removeFile(
          `products/${product.shop.id}/${product.image_name_6}`,
        );

        if (details.shop_id) {
          uploadedImageUrl6 = await this.doSpacesService.uploadFile(
            files.find((el) => el.fieldname === 'image_file_6'),
            details.shop_id,
            'products',
          );
        } else {
          uploadedImageUrl6 = await this.doSpacesService.uploadFile(
            files.find((el) => el.fieldname === 'image_file_6'),
            product.shop.id,
            'products',
          );
        }
      }

      let uploadedImageUrl7;

      if (details.image_file_7) {
        await this.doSpacesService.removeFile(
          `products/${product.shop.id}/${product.image_name_7}`,
        );

        if (details.shop_id) {
          uploadedImageUrl7 = await this.doSpacesService.uploadFile(
            files.find((el) => el.fieldname === 'image_file_7'),
            details.shop_id,
            'products',
          );
        } else {
          uploadedImageUrl7 = await this.doSpacesService.uploadFile(
            files.find((el) => el.fieldname === 'image_file_7'),
            product.shop.id,
            'products',
          );
        }
      }

      let uploadedImageUrl8;

      if (details.image_file_8) {
        await this.doSpacesService.removeFile(
          `products/${product.shop.id}/${product.image_name_8}`,
        );

        if (details.shop_id) {
          uploadedImageUrl8 = await this.doSpacesService.uploadFile(
            files.find((el) => el.fieldname === 'image_file_8'),
            details.shop_id,
            'products',
          );
        } else {
          uploadedImageUrl8 = await this.doSpacesService.uploadFile(
            files.find((el) => el.fieldname === 'image_file_8'),
            product.shop.id,
            'products',
          );
        }
      }

      let uploadedImageUrl9;

      if (details.image_file_9) {
        // await this.doSpacesService.removeFile(
        //   `products/${product.shop.id}/${product.image_name_9}`,
        // );

        if (details.shop_id) {
          uploadedImageUrl9 = await this.doSpacesService.uploadFile(
            files.find((el) => el.fieldname === 'image_file_9'),
            details.shop_id,
            'products',
          );
        } else {
          uploadedImageUrl9 = await this.doSpacesService.uploadFile(
            files.find((el) => el.fieldname === 'image_file_9'),
            product.shop.id,
            'products',
          );
        }
      }

      const updatedProduct = await this.productService.updateProduct(
        details,
        parseInt(productId),
        category,
        shop,
        uploadedImageUrl,
        uploadedImageUrl2,
        uploadedImageUrl3,
        uploadedImageUrl4,
        uploadedImageUrl5,
        uploadedImageUrl6,
        uploadedImageUrl7,
        uploadedImageUrl8,
        uploadedImageUrl9,
        uploadedVideoUrl,
      );

      await this.activityLogService.createActivityLog({
        title: 'update-product',
        description: `A product named ${updatedProduct.name} was updated by ${updatedProduct.shop.seller.first_name} ${updatedProduct.shop.seller.last_name} in its shop named ${updatedProduct.shop.name}`,
        ip_address: ip,
      });

      return { message: 'Updated product details successfully.' };
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }

  @Patch('add-quantity/:product_id')
  async addQuantity(
    @Body() body: any,
    @Param('product_id') productId,
    @Req() request,
  ) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const product = await this.productService.findById(productId);

      if (!product) {
        throw new BadRequestException('No Product Found.');
      }

      await this.productService.addQuantity(
        product.id,
        Number(body.details.quantity),
      );

      return { message: 'Deactivated product successfully.' };
    } catch (e) {
      if (e.response.message === 'No Product Found.') {
        throw new BadRequestException('No Product Found.');
      }
      throw new UnauthorizedException();
    }
  }

  @Patch('deactivate/:product_id')
  async deactivateProduct(@Param('product_id') productId, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const product = await this.productService.findById(productId);

      if (!product) {
        throw new BadRequestException('No Product Found.');
      }

      await this.productService.deactivateProduct(product.id);

      return { message: 'Deactivated product successfully.' };
    } catch (e) {
      if (e.response.message === 'No Product Found.') {
        throw new BadRequestException('No Product Found.');
      }
      throw new UnauthorizedException();
    }
  }

  @Patch('activate/:product_id')
  async activateProduct(@Param('product_id') productId, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const product = await this.productService.findById(productId);

      if (!product) {
        throw new BadRequestException('No Product Found.');
      }

      await this.productService.activateProduct(product.id);

      return { message: 'Activated product successfully.' };
    } catch (e) {
      if (e.response.message === 'No Product Found.') {
        throw new BadRequestException('No Product Found.');
      }
      throw new UnauthorizedException();
    }
  }
}
