import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from 'src/follow/entities/follow.entity';
import { ActiveType } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { Product } from 'src/product/entities/product.entity';
import { Shop } from 'src/shop/entities/shop.entity';
import { Customer } from 'src/customer/entities/customer.entity';

@Injectable()
export class FollowService {
  /**
   * Here, we have used data mapper approach for this tutorial that is why we
   * injecting repository here. Another approach can be Active records.
   */
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
  ) {}

  /**
   * this is function is used to create Follow  in Follow Balance Entity.
   * @param createFollowDto this will type of createFollowDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of follow
   */
  async createFollow(
    followId: string,
    shop: Shop,
    customer: Customer
  ): Promise<Follow> {
    const follow: Follow = new Follow();

    follow.follow_id = followId;
    follow.shop = shop;
    follow.customer = customer;
    follow.is_active = ActiveType.Active;

    return this.followRepository.save(follow);
  }

  /**
   * this function is used to get all the follow's list
   * @returns promise of array of follows
   */
  async findAllFollow(): Promise<Follow[]> {
    return this.followRepository.find({
      relations: {
          shop: true,
          customer: true
      },
    });
  }

  async findById(id: number): Promise<Follow | undefined> {
    return this.followRepository.findOne({
      where: { id },
      relations: {
        shop: true,
        customer: true
    },
    });
  }

  async findByShopId(shop_id: number): Promise<Follow | undefined> {
    return this.followRepository.findOne({
      where: { shop: {
        id: shop_id,
        is_active: 1
      } },
      relations: {
        shop: true,
        customer: true
    },
    });
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param id is type of number, which represent the id of follow.
   * @returns promise of follow
   */
  async viewFollow(id: number): Promise<Follow> {
    return this.followRepository.findOneBy({ id });
  }

  async unfollowShop(id: number): Promise<any> {
    const follow = await this.findById(id);

    if (!follow) {
      throw new NotFoundException(`Follow  not found`);
    }

    follow.is_active = ActiveType.NotActive;

    await this.followRepository.delete(follow);

    return { message: 'Shop unfollowed successfully' };
  }

  async deactivateFollow(id: number): Promise<Follow> {
    const follow = await this.findById(id);

    if (!follow) {
      throw new NotFoundException(`Follow  not found`);
    }

    follow.is_active = ActiveType.NotActive;

    return await this.followRepository.save(follow);
  }

  async activateFollow(id: number): Promise<Follow> {
    const follow = await this.findById(id);

    if (!follow) {
      throw new NotFoundException(`Follow  not found`);
    }

    follow.is_active = ActiveType.Active;

    return await this.followRepository.save(follow);
  }

  /**
   * this function is used to remove or delete follow from database.
   * @param id is the type of number, which represent id of follow
   * @returns number of rows deleted or affected
   */
  async removeFollow(id: number): Promise<{ affected?: number }> {
    return this.followRepository.delete(id);
  }
}
