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
import { CategoryService } from 'src/category/category.service';
import { SellerService } from 'src/seller/seller.service';
import { ProductService } from './product.service';

@Controller('category')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly sellerService: SellerService,
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

      return this.productService.findAllProduct();
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
  async addProduct(@Body() body: any, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      if (Object.keys(body.details).length === 0) return;

      const category = await this.categoryService.findById(
        body.details.category_id,
      );

      const seller = await this.sellerService.findById(body.details.seller_id);

      await this.productService.createProduct(body.details, category, seller);

      return { message: 'Created Product Successfully.' };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Patch('update/:product_id')
  async updateProduct(
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

      if (Object.keys(body.details).length === 0) return;

      let category;
      let seller;

      if (body.details.category_id) {
        category = await this.categoryService.findById(
          body.details.category_id,
        );

        if (!category) {
          throw new BadRequestException('No Category Found.');
        }
      }

      if (body.details.seller_id) {
        seller = await this.sellerService.findById(body.details.seller_id);

        if (!seller) {
          throw new BadRequestException('No Seller Found.');
        }
      }

      const product = await this.productService.findById(productId);

      if (!product) {
        throw new BadRequestException('No Product Found.');
      }

      await this.productService.updateProduct(
        body,
        parseInt(productId),
        category,
        seller,
      );

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
