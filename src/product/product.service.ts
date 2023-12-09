import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/category/entities/category.entity';
import { Shop } from 'src/shop/entities/shop.entity';
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
   * @returns promise of shop
   */
  async createProduct(
    createProductDto: CreateProductDto,
    uploadedImageUrl: any,
    category: Category,
    shop: Shop,
    uploadedVideoUrl?: any
  ): Promise<Product> {
    const product: Product = new Product();

    product.category = category;
    product.shop = shop;
    product.name = createProductDto.name;
    product.description = createProductDto.description;
    product.image_name = uploadedImageUrl.fileName;
    product.image_file = uploadedImageUrl.url;
    product.video_name = uploadedVideoUrl?.fileName;
    product.video_file = uploadedVideoUrl?.url;
    product.price = createProductDto.price;
    product.quantity = createProductDto.quantity;
    product.is_active = ActiveType.Active;

    // Convert the title to lowercase
    const lowercaseTitle = product.name.toLowerCase();

    // Replace special characters with empty strings using a regular expression
    const withoutSpecialChars = lowercaseTitle.replace(/\s+/g, "-");

    // Replace spaces with hyphens
    const removeExtraSpecialChars = withoutSpecialChars.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-\&-/g, "-");

    const productSlug = removeExtraSpecialChars.replace(/[^a-z0-9-]/g, "");

    product.slug = productSlug;

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
        shop: {
          seller: true,
        },
      },
    });
  }

  async findLatestProducts(): Promise<Product[]> {
    return this.productRepository.find({
      where: {
        is_active: 1
      },
      relations: {
        category: true,
        shop: {
          seller: true,
        },
      },
      order: {
        created_at: 'DESC', // Replace 'dateField' with the actual field you want to sort by
      },
      take: 8,
    });
  }

  async findById(id: number): Promise<Product | undefined> {
    return this.productRepository.findOne({
      where: { id },
      relations: {
        category: true,
        shop: {
          seller: true,
        },
      },
    });
  }

  async findBySlug(slug: string, seller_id: number): Promise<Product | undefined> {
    return this.productRepository.findOne({
      where: { slug, is_active: 1, shop: {seller: {id: seller_id}} },
      relations: {
        category: true,
        shop: {
          seller: true,
        },
      },
    });
  }

  async findBySlugAndShop(slug: string, shop: string): Promise<Product | undefined> {
    return this.productRepository.findOne({
      where: { slug, is_active: 1, shop: {name: shop} },
      relations: {
        category: true,
        shop: {
          seller: true,
        },
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

  async increaseProductQuantity(
    id: number,
    quantity: number,
  ): Promise<Product> {
    const product = await this.productRepository.findOneBy({
      id,
    });

    if (!product) {
      throw new NotFoundException(`Product not found`);
    }

    if (quantity) {
      product.quantity = product.quantity + quantity;
    }

    return await this.productRepository.save(product);
  }

  async decreaseProductQuantity(
    id: number,
    quantity: number,
  ): Promise<Product> {
    const product = await this.productRepository.findOneBy({
      id,
    });

    if (!product) {
      throw new NotFoundException(`Product not found`);
    }

    if (quantity) {
      product.quantity = product.quantity - quantity;
    }

    return await this.productRepository.save(product);
  }

  /**
   * this function is used to updated specific user whose id is passed in
   * parameter along with passed updated data
   * @param id is type of number, which represent the id of user.
   * @param updateProductDto this is partial type of createProductDto.
   * @returns promise of update product
   */
  async updateProduct(
    details: any,
    uploadedImageUrl: any,
    id: number,
    category: Category,
    shop: Shop,
    uploadedVideoUrl?: any
  ): Promise<Product> {
    const product = await this.findById(
      id,
    );

    if (!product) {
      throw new NotFoundException(`Product not found`);
    }

    if (category) {
      product.category = category;
    }

    if (shop) {
      product.shop = shop;

      if (!details.image_file) {
        product.image_file = uploadedImageUrl.url;
        product.image_name = uploadedImageUrl.fileName;
      }

      if (!details.video_file) {
        product.video_file = uploadedVideoUrl.url;
        product.video_name = uploadedVideoUrl.fileName;
      }
    }

    if (details.name) {
      product.name = details.name;

      // Convert the title to lowercase
      const lowercaseTitle = product.name.toLowerCase();

      // Replace special characters with empty strings using a regular expression
      const withoutSpecialChars = lowercaseTitle.replace(/[^\w\s-]/g, '');

      // Replace spaces with hyphens
      const productSlug = withoutSpecialChars.replace(/\s+/g, '-');

      product.slug = productSlug;
    }

    if (details.description) {
      product.description = details.description;
    }

    if (details.image_file) {
      product.image_file = uploadedImageUrl.url;
      product.image_name = uploadedImageUrl.fileName;
    }

    if (details.video_file) {
      product.video_file = uploadedVideoUrl.url;
      product.video_name = uploadedVideoUrl.fileName;
    }

    if (details.price) {
      product.price = details.price;
    }

    if (details.quantity) {
      product.quantity = details.quantity;
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
