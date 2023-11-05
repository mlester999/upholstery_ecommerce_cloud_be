import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveType } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DeliveryStatusType, Order } from './entities/order.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class OrderService {
  /**
   * Here, we have used data mapper approach for this tutorial that is why we
   * injecting repository here. Another approach can be Active records.
   */
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  /**
   * this is function is used to create Order in Order Entity.
   * @param createOrderDto this will type of createOrderDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of order
   */
  async createOrder(
    createOrderDto: CreateOrderDto,
    customer: Customer,
    products: any,
    randomOrderId: string,
  ): Promise<Order> {
    const order: Order = new Order();

    order.customer = customer;
    order.products = products;
    order.order_id = randomOrderId;
    order.is_active = ActiveType.Active;
    order.payment_method = createOrderDto.payment_method;
    order.subtotal_price = createOrderDto.subtotal_price;
    order.total_quantity = createOrderDto.total_quantity;

    if (createOrderDto.source_id) {
      order.source_id = createOrderDto.source_id;
    }

    return this.orderRepository.save(order);
  }

  /**
   * this function is used to get all the order's list
   * @returns promise of array of orders
   */
  async findAllOrder(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: {
        customer: true,
      },
    });
  }

  async findById(id: number): Promise<Order | undefined> {
    return this.orderRepository.findOne({
      where: { id },
      relations: {
        customer: true,
      },
    });
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param id is type of number, which represent the id of order.
   * @returns promise of order
   */
  async viewOrder(id: number): Promise<Order> {
    return this.orderRepository.findOneBy({ id });
  }

  /**
   * this function is used to updated specific order whose id is passed in
   * parameter along with passed updated data
   * @param id is type of number, which represent the id of order.
   * @param updateOrderDto this is partial type of createOrderDto.
   * @returns promise of update order
   */
  async updateOrder(details: any, id: number): Promise<Order> {
    const order = await this.orderRepository.findOneBy({
      id,
    });

    if (!order) {
      throw new NotFoundException(`Order not found`);
    }

    if (details.products) {
      order.products = JSON.stringify(details.products);
    }

    if (details.total_quantity) {
      order.total_quantity = details.total_quantity;
    }

    if (details.subtotal_price) {
      order.subtotal_price = details.subtotal_price;
    }

    return await this.orderRepository.save(order);
  }

  async deactivateOrder(id: number): Promise<Order> {
    const order = await this.findById(id);

    if (!order) {
      throw new NotFoundException(`Order not found`);
    }

    order.is_active = ActiveType.NotActive;

    return await this.orderRepository.save(order);
  }

  async activateOrder(id: number): Promise<Order> {
    const order = await this.findById(id);

    if (!order) {
      throw new NotFoundException(`Order not found`);
    }

    order.is_active = ActiveType.Active;

    return await this.orderRepository.save(order);
  }

  /**
   * this function is used to remove or delete order from database.
   * @param id is the type of number, which represent id of order
   * @returns number of rows deleted or affected
   */
  async removeOrder(id: number): Promise<{ affected?: number }> {
    return this.orderRepository.delete(id);
  }
}
