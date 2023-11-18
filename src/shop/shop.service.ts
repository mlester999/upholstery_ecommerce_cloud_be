import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seller } from 'src/seller/entities/seller.entity';
import { ActiveType } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { Shop } from './entities/shop.entity';

@Injectable()
export class ShopService {
  /**
   * Here, we have used data mapper approach for this tutorial that is why we
   * injecting repository here. Another approach can be Active records.
   */
  constructor(
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,
  ) {}

  /**
   * this is function is used to create Shop in Shop Entity.
   * @param createShopDto this will type of createShopDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of shop
   */
  async createShop(
    createShopDto: CreateShopDto,
    seller: Seller,
  ): Promise<Shop> {
    const shop: Shop = new Shop();

    shop.seller = seller;
    shop.name = createShopDto.name;
    shop.description = createShopDto.description;
    shop.is_active = ActiveType.Active;

    return this.shopRepository.save(shop);
  }

  /**
   * this function is used to get all the shop's list
   * @returns promise of array of shops
   */
  async findAllShop(): Promise<Shop[]> {
    return this.shopRepository.find({
      relations: {
        seller: true,
      },
    });
  }

  async findById(id: number): Promise<Shop | undefined> {
    return this.shopRepository.findOne({
      where: { id },
      relations: {
        seller: true,
      },
    });
  }

  async findBySlug(slug: string): Promise<Shop | undefined> {
    return this.shopRepository.findOne({
      where: { name: slug },
      relations: {
        seller: true,
      },
    });
  }

  async findBySellerId(id: number): Promise<Shop | undefined> {
    return this.shopRepository.findOne({
      where: {
        seller: {
          id,
        },
        is_active: 1,
      },
      relations: {
        seller: true,
      },
    });
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param id is type of number, which represent the id of shop.
   * @returns promise of shop
   */
  async viewShop(id: number): Promise<Shop> {
    return this.shopRepository.findOneBy({ id });
  }

  /**
   * this function is used to updated specific shop whose id is passed in
   * parameter along with passed updated data
   * @param id is type of number, which represent the id of shop.
   * @param updateShopDto this is partial type of createShopDto.
   * @returns promise of update shop
   */
  async updateShop(body: any, id: number, seller: Seller): Promise<Shop> {
    const shop = await this.findById(
      id,
    );

    if (!shop) {
      throw new NotFoundException(`Shop not found`);
    }

    if (seller) {
      shop.seller = seller;
    }

    if (body.details.name) {
      shop.name = body.details.name;
    }

    if (body.details.description) {
      shop.description = body.details.description;
    }

    if (body.details.is_active) {
      shop.is_active = body.details.is_active;
    }

    return await this.shopRepository.save(shop);
  }

  async deactivateShop(id: number): Promise<Shop> {
    const shop = await this.findById(id);

    if (!shop) {
      throw new NotFoundException(`Shop not found`);
    }

    shop.is_active = ActiveType.NotActive;

    return await this.shopRepository.save(shop);
  }

  async activateShop(id: number): Promise<Shop> {
    const shop = await this.findById(id);

    if (!shop) {
      throw new NotFoundException(`Shop not found`);
    }

    shop.is_active = ActiveType.Active;

    return await this.shopRepository.save(shop);
  }

  /**
   * this function is used to remove or delete shop from database.
   * @param id is the type of number, which represent id of shop
   * @returns number of rows deleted or affected
   */
  async removeShop(id: number): Promise<{ affected?: number }> {
    return this.shopRepository.delete(id);
  }
}
