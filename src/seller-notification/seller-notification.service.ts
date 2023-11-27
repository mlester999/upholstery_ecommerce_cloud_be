import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveType } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateSellerNotificationDto } from './dto/create-seller-notification.dto';
import { UpdateSellerNotificationDto } from './dto/update-seller-notification.dto';
import { Product } from 'src/product/entities/product.entity';
import { Shop } from 'src/shop/entities/shop.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { SellerNotification } from './entities/seller-notification.entity';
import { Seller } from 'src/seller/entities/seller.entity';
import { Admin } from 'src/admin/entities/admin.entity';

@Injectable()
export class SellerNotificationService {
  /**
   * Here, we have used data mapper approach for this tutorial that is why we
   * injecting repository here. Another approach can be Active records.
   */
  constructor(
    @InjectRepository(SellerNotification)
    private readonly sellerNotificationRepository: Repository<SellerNotification>,
  ) {}

  /**
   * this is function is used to create SellerNotification  in SellerNotification Balance Entity.
   * @param createSellerSellerNotificationDto this will type of createSellerSellerNotificationDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of sellerNotification
   */
  async createSellerNotification(
    createSellerSellerNotificationDto: CreateSellerNotificationDto,
    sellerNotificationId: string,
    admin: Admin,
    seller: Seller
  ): Promise<SellerNotification> {
    const sellerNotification: SellerNotification = new SellerNotification();

    sellerNotification.seller_notification_id = sellerNotificationId;
    sellerNotification.title = createSellerSellerNotificationDto.title;
    sellerNotification.description = createSellerSellerNotificationDto.description;
    sellerNotification.admin = admin;
    sellerNotification.seller = seller;
    sellerNotification.is_active = ActiveType.Active;

    return this.sellerNotificationRepository.save(sellerNotification);
  }

  /**
   * this function is used to get all the sellerNotification's list
   * @returns promise of array of sellerNotifications
   */
  async findAllSellerNotification(): Promise<SellerNotification[]> {
    return this.sellerNotificationRepository.find({
      relations: {
          admin: true,
          seller: true
      },
    });
  }

  async findById(id: number): Promise<SellerNotification | undefined> {
    return this.sellerNotificationRepository.findOne({
      where: { id },
      relations: {
        admin: true,
        seller: true
    },
    });
  }

  async findBySellerId(seller_id: number): Promise<SellerNotification[] | undefined> {
    return this.sellerNotificationRepository.find({
      where: { seller: {
        id: seller_id,
      }, is_active: 1 },
      relations: {
        admin: true,
        seller: true
    },
    order: {created_at: 'DESC'}
    });
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param id is type of number, which represent the id of sellerNotification.
   * @returns promise of sellerNotification
   */
  async viewSellerNotification(id: number): Promise<SellerNotification> {
    return this.sellerNotificationRepository.findOneBy({ id });
  }

  async deactivateSellerNotification(id: number): Promise<SellerNotification> {
    const sellerNotification = await this.findById(id);

    if (!sellerNotification) {
      throw new NotFoundException(`SellerNotification  not found`);
    }

    sellerNotification.is_active = ActiveType.NotActive;

    return await this.sellerNotificationRepository.save(sellerNotification);
  }

  async activateSellerNotification(id: number): Promise<SellerNotification> {
    const sellerNotification = await this.findById(id);

    if (!sellerNotification) {
      throw new NotFoundException(`SellerNotification  not found`);
    }

    sellerNotification.is_active = ActiveType.Active;

    return await this.sellerNotificationRepository.save(sellerNotification);
  }

  /**
   * this function is used to remove or delete sellerNotification from database.
   * @param id is the type of number, which represent id of sellerNotification
   * @returns number of rows deleted or affected
   */
  async removeSellerNotification(id: number): Promise<{ affected?: number }> {
    return this.sellerNotificationRepository.delete(id);
  }
}
