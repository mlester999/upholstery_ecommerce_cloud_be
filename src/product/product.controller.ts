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
} from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoryService } from 'src/category/category.service';
import { ShopService } from 'src/shop/shop.service';
import { ProductService } from './product.service';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly shopService: ShopService,
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

      return await this.productService.findAllProduct();
    } catch (e) {
      throw new UnauthorizedException();
    }
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

  @Post('add')
  @UseInterceptors(
    FileInterceptor('image_file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          // Set the destination path to your public/assets folder
          const uploadPath = path.resolve('../frontend/public/assets');
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  async addProduct(
    @Body() body: any,
    @Req() request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      const newFileToRemove = path.resolve(
        `../frontend/public/assets/${file.filename}`,
      );

      if (!data) {
        fs.unlinkSync(newFileToRemove);
        throw new UnauthorizedException();
      }

      const details = JSON.parse(body.details);

      if (Object.keys(details).length <= 1) return;

      const category = await this.categoryService.findById(details.category_id);

      if (!category) {
        fs.unlinkSync(newFileToRemove);
        throw new BadRequestException('No Category Found.');
      }

      const shop = await this.shopService.findById(details.shop_id);

      if (!shop) {
        fs.unlinkSync(newFileToRemove);
        throw new BadRequestException('No Shop Found.');
      }

      await this.productService.createProduct(details, file, category, shop);

      return { message: 'Created Product Successfully.' };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Patch('update/:product_id')
  @UseInterceptors(
    FileInterceptor('image_file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          // Set the destination path to your public/assets folder
          const uploadPath = path.resolve('../frontend/public/assets');
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  async updateProduct(
    @Body() body: any,
    @Param('product_id') productId,
    @Req() request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      let newFileToRemove;

      if (file?.filename) {
        newFileToRemove = path.resolve(
          `../frontend/public/assets/${file.filename}`,
        );
      }

      if (!data) {
        if (file?.filename) {
          fs.unlinkSync(newFileToRemove);
        }

        throw new UnauthorizedException();
      }

      const details = JSON.parse(body.details);

      if (Object.keys(details).length <= 1) return;

      let category;
      let shop;

      if (details.category_id) {
        category = await this.categoryService.findById(details.category_id);

        if (!category) {
          fs.unlinkSync(newFileToRemove);
          throw new BadRequestException('No Category Found.');
        }
      }

      if (details.shop_id) {
        shop = await this.shopService.findById(details.shop_id);

        if (!shop) {
          fs.unlinkSync(newFileToRemove);
          throw new BadRequestException('No Shop Found.');
        }
      }

      const product = await this.productService.findById(productId);

      if (!product) {
        fs.unlinkSync(newFileToRemove);
        throw new BadRequestException('No Product Found.');
      }

      await this.productService.updateProduct(
        details,
        file,
        parseInt(productId),
        category,
        shop,
      );

      if (file) {
        const existingFileToRemove = path.resolve(
          `../frontend/public/assets/${product.image_name}`,
        );

        fs.unlinkSync(existingFileToRemove);
      }

      return { message: 'Updated product details successfully.' };
    } catch (e) {
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

      return { message: 'Deactivated category successfully.' };
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
