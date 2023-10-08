import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/category/entities/category.entity';
import { Seller } from 'src/seller/entities/seller.entity';
import { ActiveType } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  /**
   * Here, we have used data mapper approach for this tutorial that is why we
   * injecting repository here. Another approach can be Active records.
   */
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * this is function is used to create Product in Product Entity.
   * @param createProductDto this will type of createProductDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of seller
   */
  async createProduct(
    createProductDto: CreateProductDto,
    category: Category,
    seller: Seller,
  ): Promise<Product> {
    const product: Product = new Product();

    product.category = category;
    product.seller = seller;
    product.name = createProductDto.name;
    product.description = createProductDto.description;
    product.image_file = createProductDto.image_file;
    product.price = createProductDto.price;
    product.is_active = ActiveType.Active;

    return this.productRepository.save(product);
  }

  /**
   * this function is used to get all the product's list
   * @returns promise of array of products
   */
  async findAllProduct(): Promise<Product[]> {
    return this.productRepository.find({
      relations: {
        category: true,
        seller: true,
      },
    });
  }

  async findById(id: number): Promise<Product | undefined> {
    return this.productRepository.findOne({
      where: { id },
      relations: {
        category: true,
        seller: true,
      },
    });
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param id is type of number, which represent the id of user.
   * @returns promise of user
   */
  async viewProduct(id: number): Promise<Product> {
    return this.productRepository.findOneBy({ id });
  }

  /**
   * this function is used to updated specific user whose id is passed in
   * parameter along with passed updated data
   * @param id is type of number, which represent the id of user.
   * @param updateProductDto this is partial type of createProductDto.
   * @returns promise of update product
   */
  async updateProduct(
    body: any,
    id: number,
    category: Category,
    seller: Seller,
  ): Promise<Product> {
    const product = await this.productRepository.findOneBy({
      id,
    });

    if (!product) {
      throw new NotFoundException(`Product not found`);
    }

    if (category) {
      product.category = category;
    }

    if (seller) {
      product.seller = seller;
    }

    if (body.details.name) {
      product.name = body.details.name;
    }

    if (body.details.description) {
      product.description = body.details.description;
    }

    if (body.details.image_file) {
      product.image_file = body.details.image_file;
    }

    if (body.details.price) {
      product.price = body.details.price;
    }

    return await this.productRepository.save(product);
  }

  async deactivateProduct(id: number): Promise<Product> {
    const product = await this.findById(id);

    if (!product) {
      throw new NotFoundException(`Product not found`);
    }

    product.is_active = ActiveType.NotActive;

    return await this.productRepository.save(product);
  }

  async activateProduct(id: number): Promise<Product> {
    const product = await this.findById(id);

    if (!product) {
      throw new NotFoundException(`Product not found`);
    }

    product.is_active = ActiveType.Active;

    return await this.productRepository.save(product);
  }

  /**
   * this function is used to remove or delete product from database.
   * @param id is the type of number, which represent id of product
   * @returns number of rows deleted or affected
   */
  async removeProduct(id: number): Promise<{ affected?: number }> {
    return this.productRepository.delete(id);
  }
}
