import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seller } from 'src/seller/entities/seller.entity';
import { ActiveType } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateSellerWithdrawalDto } from './dto/create-seller-withdrawal.dto';
import { UpdateSellerWithdrawalDto } from './dto/update-seller-withdrawal.dto';

import { SellerWithdrawal, SellerWithdrawalStatusType } from './entities/seller-withdrawal.entity';
import { Product } from 'src/product/entities/product.entity';
import { Shop } from 'src/shop/entities/shop.entity';

@Injectable()
export class SellerWithdrawalService {
  /**
   * Here, we have used data mapper approach for this tutorial that is why we
   * injecting repository here. Another approach can be Active records.
   */
  constructor(
    @InjectRepository(SellerWithdrawal)
    private readonly sellerWithdrawalRepository: Repository<SellerWithdrawal>,
  ) {}

  /**
   * this is function is used to create Seller Withdrawal in Seller Balance Entity.
   * @param createSellerWithdrawalDto this will type of createSellerWithdrawalDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of sellerWithdrawal
   */
  async createSellerWithdrawal(
    createSellerWithdrawalDto: CreateSellerWithdrawalDto,
    sellerWithdrawalId: string,
    seller: Seller,
  ): Promise<SellerWithdrawal> {
    const sellerWithdrawal: SellerWithdrawal = new SellerWithdrawal();

    sellerWithdrawal.seller = seller;
    sellerWithdrawal.seller_withdrawal_id = sellerWithdrawalId;
    sellerWithdrawal.amount = createSellerWithdrawalDto.amount;
    sellerWithdrawal.commission_fee = createSellerWithdrawalDto.commission_fee;
    sellerWithdrawal.total_withdrawal = createSellerWithdrawalDto.total_withdrawal;
    sellerWithdrawal.status = SellerWithdrawalStatusType.PendingWithdrawal;
    sellerWithdrawal.is_active = ActiveType.Active;

    return this.sellerWithdrawalRepository.save(sellerWithdrawal);
  }

  /**
   * this function is used to get all the sellerWithdrawal's list
   * @returns promise of array of sellerWithdrawals
   */
  async findAllSellerWithdrawal(): Promise<SellerWithdrawal[]> {
    return this.sellerWithdrawalRepository.find({
      relations: {
          seller: true
      },
    });
  }

  async findById(id: number): Promise<SellerWithdrawal | undefined> {
    return this.sellerWithdrawalRepository.findOne({
      where: { id },
      relations: {
          seller: true
      },
    });
  }

  async findBySellerId(id: number): Promise<SellerWithdrawal | undefined> {
    return this.sellerWithdrawalRepository.findOne({
      where: {
        seller: {
          id,
        },
        is_active: 1,
      },
      relations: {
        seller: true
      },
    });
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param id is type of number, which represent the id of sellerWithdrawal.
   * @returns promise of sellerWithdrawal
   */
  async viewSellerWithdrawal(id: number): Promise<SellerWithdrawal> {
    return this.sellerWithdrawalRepository.findOneBy({ id });
  }

  /**
   * this function is used to updated specific sellerWithdrawal whose id is passed in
   * parameter along with passed updated data
   * @param id is type of number, which represent the id of sellerWithdrawal.
   * @param updateSellerWithdrawalDto this is partial type of createSellerWithdrawalDto.
   * @returns promise of update sellerWithdrawal
   */
  async updateSellerWithdrawal(body: any, id: number, seller: Seller): Promise<SellerWithdrawal> {
    const sellerWithdrawal = await this.findById(
      id,
    );

    if (!sellerWithdrawal) {
      throw new NotFoundException(`Seller Withdrawal not found`);
    }

    if (seller) {
      sellerWithdrawal.seller = seller;
    }

    if (body.details.amount) {
      sellerWithdrawal.amount = body.details.amount;
    }

    if (body.details.commission_fee) {
      sellerWithdrawal.commission_fee = body.details.commission_fee;
    }

    if (body.details.total_withdrawal) {
      sellerWithdrawal.total_withdrawal = body.details.total_withdrawal;
    }

    if (body.details.status) {
      sellerWithdrawal.status = body.details.status;
    }

    if (body.details.is_active) {
      sellerWithdrawal.is_active = body.details.is_active;
    }

    return await this.sellerWithdrawalRepository.save(sellerWithdrawal);
  }

  async updateStatus(status: string, id: number): Promise<SellerWithdrawal> {
    const sellerWithdrawal = await this.findById(
      id,
    );

    if (!sellerWithdrawal) {
      throw new NotFoundException(`Seller Withdrawal not found`);
    }

    if (status) {
      sellerWithdrawal.status = status;
    }

    return await this.sellerWithdrawalRepository.save(sellerWithdrawal);
  }

  async deactivateSellerWithdrawal(id: number): Promise<SellerWithdrawal> {
    const sellerWithdrawal = await this.findById(id);

    if (!sellerWithdrawal) {
      throw new NotFoundException(`Seller Withdrawal not found`);
    }

    sellerWithdrawal.is_active = ActiveType.NotActive;

    return await this.sellerWithdrawalRepository.save(sellerWithdrawal);
  }

  async activateSellerWithdrawal(id: number): Promise<SellerWithdrawal> {
    const sellerWithdrawal = await this.findById(id);

    if (!sellerWithdrawal) {
      throw new NotFoundException(`Seller Withdrawal not found`);
    }

    sellerWithdrawal.is_active = ActiveType.Active;

    return await this.sellerWithdrawalRepository.save(sellerWithdrawal);
  }

  /**
   * this function is used to remove or delete sellerWithdrawal from database.
   * @param id is the type of number, which represent id of sellerWithdrawal
   * @returns number of rows deleted or affected
   */
  async removeSellerWithdrawal(id: number): Promise<{ affected?: number }> {
    return this.sellerWithdrawalRepository.delete(id);
  }
}
