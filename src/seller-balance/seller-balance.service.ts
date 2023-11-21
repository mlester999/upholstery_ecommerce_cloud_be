import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seller } from 'src/seller/entities/seller.entity';
import { ActiveType } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateSellerBalanceDto } from './dto/create-seller-balance.dto';
import { UpdateSellerBalanceDto } from './dto/update-seller-balance.dto';

import { SellerBalance, SellerBalanceStatusType } from './entities/seller-balance.entity';
import { Product } from 'src/product/entities/product.entity';
import { Shop } from 'src/shop/entities/shop.entity';

@Injectable()
export class SellerBalanceService {
  /**
   * Here, we have used data mapper approach for this tutorial that is why we
   * injecting repository here. Another approach can be Active records.
   */
  constructor(
    @InjectRepository(SellerBalance)
    private readonly sellerBalanceRepository: Repository<SellerBalance>,
  ) {}

  /**
   * this is function is used to create Seller Balance in Seller Balance Entity.
   * @param createSellerBalanceDto this will type of createSellerBalanceDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of sellerBalance
   */
  async createSellerBalance(
    createSellerBalanceDto: CreateSellerBalanceDto,
    sellerBalanceId: string,
    orderId: string,
    shop: Shop,
    product: Product,
  ): Promise<SellerBalance> {
    const sellerBalance: SellerBalance = new SellerBalance();

    sellerBalance.shop = shop;
    sellerBalance.product = product;
    sellerBalance.order_id = orderId;
    sellerBalance.seller_balance_id = sellerBalanceId;
    sellerBalance.amount = createSellerBalanceDto.amount;
    sellerBalance.status = SellerBalanceStatusType.Pending;
    sellerBalance.is_active = ActiveType.Active;

    return this.sellerBalanceRepository.save(sellerBalance);
  }

  /**
   * this function is used to get all the sellerBalance's list
   * @returns promise of array of sellerBalances
   */
  async findAllSellerBalance(): Promise<SellerBalance[]> {
    return this.sellerBalanceRepository.find({
      relations: {
        shop: {
          seller: true
        },
        product: true,
      },
    });
  }

  async findAllCompletedSellerBalance(): Promise<SellerBalance[]> {
    return this.sellerBalanceRepository.find({
      where: { status: SellerBalanceStatusType.Completed },
      relations: {
        shop: {
          seller: true
        },
        product: true,
      },
    });
  }

  async findById(id: number): Promise<SellerBalance | undefined> {
    return this.sellerBalanceRepository.findOne({
      where: { id },
      relations: {
        shop: {
          seller: true
        },
        product: true,
      },
    });
  }

  async findByShopId(id: number): Promise<SellerBalance | undefined> {
    return this.sellerBalanceRepository.findOne({
      where: {
        shop: {
          id,
        },
        is_active: 1,
      },
      relations: {
        shop: {
          seller: true
        },
        product: true,
      },
    });
  }

  async findByOrderId(order_id: string, product_id: number, shop_id: number): Promise<SellerBalance | undefined> {
    return this.sellerBalanceRepository.findOne({
      where: {
        order_id,
        shop: {
          id: shop_id
        },
        product: {
          id: product_id
        }
      },
      relations: {
        shop: {
          seller: true
        },
        product: true,
      },
    });
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param id is type of number, which represent the id of sellerBalance.
   * @returns promise of sellerBalance
   */
  async viewSellerBalance(id: number): Promise<SellerBalance> {
    return this.sellerBalanceRepository.findOneBy({ id });
  }

  /**
   * this function is used to updated specific sellerBalance whose id is passed in
   * parameter along with passed updated data
   * @param id is type of number, which represent the id of sellerBalance.
   * @param updateSellerBalanceDto this is partial type of createSellerBalanceDto.
   * @returns promise of update sellerBalance
   */
  async updateSellerBalance(body: any, id: number, shop: Shop, product: Product): Promise<SellerBalance> {
    const sellerBalance = await this.findById(
      id,
    );

    if (!sellerBalance) {
      throw new NotFoundException(`Seller Balance not found`);
    }

    if (shop) {
      sellerBalance.shop = shop;
    }

    if (product) {
      sellerBalance.product = product;
    }

    if (body.details.amount) {
      sellerBalance.amount = body.details.amount;
    }

    if (body.details.status) {
      sellerBalance.status = body.details.status;
    }

    if (body.details.is_active) {
      sellerBalance.is_active = body.details.is_active;
    }

    return await this.sellerBalanceRepository.save(sellerBalance);
  }

  async updateStatus(status: string, id: number): Promise<SellerBalance> {
    const sellerBalance = await this.findById(
      id,
    );

    if (!sellerBalance) {
      throw new NotFoundException(`Seller Balance not found`);
    }

    if (status) {
      sellerBalance.status = status;
    }

    return await this.sellerBalanceRepository.save(sellerBalance);
  }

  async deactivateSellerBalance(id: number): Promise<SellerBalance> {
    const sellerBalance = await this.findById(id);

    if (!sellerBalance) {
      throw new NotFoundException(`Seller Balance not found`);
    }

    sellerBalance.is_active = ActiveType.NotActive;

    return await this.sellerBalanceRepository.save(sellerBalance);
  }

  async activateSellerBalance(id: number): Promise<SellerBalance> {
    const sellerBalance = await this.findById(id);

    if (!sellerBalance) {
      throw new NotFoundException(`Seller Balance not found`);
    }

    sellerBalance.is_active = ActiveType.Active;

    return await this.sellerBalanceRepository.save(sellerBalance);
  }

  /**
   * this function is used to remove or delete sellerBalance from database.
   * @param id is the type of number, which represent id of sellerBalance
   * @returns number of rows deleted or affected
   */
  async removeSellerBalance(id: number): Promise<{ affected?: number }> {
    return this.sellerBalanceRepository.delete(id);
  }
}
