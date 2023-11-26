import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/notification/entities/notification.entity';
import { ActiveType } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Product } from 'src/product/entities/product.entity';
import { Shop } from 'src/shop/entities/shop.entity';
import { Customer } from 'src/customer/entities/customer.entity';

@Injectable()
export class NotificationService {
  /**
   * Here, we have used data mapper approach for this tutorial that is why we
   * injecting repository here. Another approach can be Active records.
   */
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  /**
   * this is function is used to create Notification  in Notification Balance Entity.
   * @param createNotificationDto this will type of createNotificationDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of notification
   */
  async createNotification(
    createNotificationDto: CreateNotificationDto,
    notificationId: string,
    shop: Shop,
    customer: Customer
  ): Promise<Notification> {
    const notification: Notification = new Notification();

    notification.notification_id = notificationId;
    notification.title = createNotificationDto.title;
    notification.description = createNotificationDto.description;
    notification.shop = shop;
    notification.customer = customer;
    notification.is_active = ActiveType.Active;

    return this.notificationRepository.save(notification);
  }

  /**
   * this function is used to get all the notification's list
   * @returns promise of array of notifications
   */
  async findAllNotification(): Promise<Notification[]> {
    return this.notificationRepository.find({
      relations: {
          shop: true,
          customer: true
      },
    });
  }

  async findById(id: number): Promise<Notification | undefined> {
    return this.notificationRepository.findOne({
      where: { id },
      relations: {
        shop: true,
        customer: true
    },
    });
  }

  async findByCustomerId(customer_id: number): Promise<Notification[] | undefined> {
    return this.notificationRepository.find({
      where: { customer: {
        id: customer_id,
      }, is_active: 1 },
      relations: {
        shop: true,
        customer: true
    },
    order: {created_at: 'DESC'}
    });
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param id is type of number, which represent the id of notification.
   * @returns promise of notification
   */
  async viewNotification(id: number): Promise<Notification> {
    return this.notificationRepository.findOneBy({ id });
  }

  async deactivateNotification(id: number): Promise<Notification> {
    const notification = await this.findById(id);

    if (!notification) {
      throw new NotFoundException(`Notification  not found`);
    }

    notification.is_active = ActiveType.NotActive;

    return await this.notificationRepository.save(notification);
  }

  async activateNotification(id: number): Promise<Notification> {
    const notification = await this.findById(id);

    if (!notification) {
      throw new NotFoundException(`Notification  not found`);
    }

    notification.is_active = ActiveType.Active;

    return await this.notificationRepository.save(notification);
  }

  /**
   * this function is used to remove or delete notification from database.
   * @param id is the type of number, which represent id of notification
   * @returns number of rows deleted or affected
   */
  async removeNotification(id: number): Promise<{ affected?: number }> {
    return this.notificationRepository.delete(id);
  }
}
