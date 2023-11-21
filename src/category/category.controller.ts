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
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
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

      return this.categoryService.findAllCategory();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get('all-sorted')
  async findAllSorted() {
    return this.categoryService.findAllSortedCategory();
  }

  @Get(':category_id')
  async findOne(@Req() request, @Param('category_id') categoryId) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      return this.categoryService.findById(parseInt(categoryId));
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('add')
  async addCategory(@Body() body: any, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      if (Object.keys(body.details).length === 0) return;

      await this.categoryService.createCategory(body.details);

      return { message: 'Created Category Successfully.' };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Patch('update/:category_id')
  async updateCategory(
    @Body() body: any,
    @Param('category_id') categoryId,
    @Req() request,
  ) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      if (Object.keys(body.details).length === 0) return;

      const category = await this.categoryService.findById(categoryId);

      if (!category) {
        throw new BadRequestException('No Category Found.');
      }

      await this.categoryService.updateCategory(body, parseInt(categoryId));

      return { message: 'Updated category details successfully.' };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Patch('deactivate/:category_id')
  async deactivateCategory(@Param('category_id') categoryId, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const category = await this.categoryService.findById(categoryId);

      if (!category) {
        throw new BadRequestException('No Category Found.');
      }

      await this.categoryService.deactivateCategory(category.id);

      return { message: 'Deactivated category successfully.' };
    } catch (e) {
      if (e.response.message === 'No Category Found.') {
        throw new BadRequestException('No Category Found.');
      }
      throw new UnauthorizedException();
    }
  }

  @Patch('activate/:category_id')
  async activateCategory(@Param('category_id') categoryId, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const category = await this.categoryService.findById(categoryId);

      if (!category) {
        throw new BadRequestException('No Category Found.');
      }

      await this.categoryService.activateCategory(category.id);

      return { message: 'Activated category successfully.' };
    } catch (e) {
      if (e.response.message === 'No Category Found.') {
        throw new BadRequestException('No Category Found.');
      }
      throw new UnauthorizedException();
    }
  }
}
