import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveType } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateReturnRefundDto } from './dto/create-return-refund.dto';
import { UpdateReturnRefundDto } from './dto/update-return-refund.dto';
import { Customer } from 'src/customer/entities/customer.entity';
import { Product } from 'src/product/entities/product.entity';
import { ReturnRefund, ReturnRefundType } from './entities/return-refund.entity';

@Injectable()
export class ReturnRefundService {
  /**
   * Here, we have used data mapper approach for this tutorial that is why we
   * injecting repository here. Another approach can be Active records.
   */
  constructor(
    @InjectRepository(ReturnRefund)
    private readonly returnRefundRepository: Repository<ReturnRefund>,
  ) {}

  /**
   * this is function is used to create ReturnRefund in ReturnRefund Entity.
   * @param createReturnRefundDto this will type of createReturnRefundDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of returnRefund
   */
  async createReturnRefund(
    createReturnRefundDto: CreateReturnRefundDto,
    customer: Customer,
    product: any,
    randomReturnRefundId: string,
    uploadedUrl: any
  ): Promise<ReturnRefund> {
    const returnRefund: ReturnRefund = new ReturnRefund();

    returnRefund.customer = customer;
    returnRefund.product = product;
    returnRefund.return_refund_id = randomReturnRefundId;
    returnRefund.order_id = createReturnRefundDto.order_id;
    returnRefund.reason = createReturnRefundDto.reason;
    returnRefund.image_name = uploadedUrl.fileName;
    returnRefund.image_file = uploadedUrl.url;
    returnRefund.status = ReturnRefundType.Pending;
    returnRefund.is_active = ActiveType.Active;

    return this.returnRefundRepository.save(returnRefund);
  }

  /**
   * this function is used to get all the returnRefund's list
   * @returns promise of array of returnRefunds
   */
  async findAllReturnRefund(): Promise<ReturnRefund[]> {
    return this.returnRefundRepository.find({
      relations: {
        customer: true
      },
    });
  }

  async findById(id: number): Promise<ReturnRefund | undefined> {
    return this.returnRefundRepository.findOne({
      where: { id }
    });
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param id is type of number, which represent the id of returnRefund.
   * @returns promise of returnRefund
   */
  async viewReturnRefund(id: number): Promise<ReturnRefund> {
    return this.returnRefundRepository.findOneBy({ id });
  }

  /**
   * this function is used to updated specific returnRefund whose id is passed in
   * parameter along with passed updated data
   * @param id is type of number, which represent the id of returnRefund.
   * @param updateReturnRefundDto this is partial type of createReturnRefundDto.
   * @returns promise of update returnRefund
   */
  async updateReturnRefund(details: any, id: number, uploadedUrl: any): Promise<ReturnRefund> {
    const returnRefund = await this.returnRefundRepository.findOneBy({
      id,
    });

    if (!returnRefund) {
      throw new NotFoundException(`ReturnRefund not found`);
    }

    if (details.products) {
      returnRefund.product = JSON.stringify(details.product);
    }

    if (details.reason) {
      returnRefund.reason = details.reason;
    }

    if (details.image_file) {
      returnRefund.image_file = uploadedUrl.url;
      returnRefund.image_name = uploadedUrl.fileName;
    }

    if (details.status) {
      returnRefund.status = details.status;
    }

    return await this.returnRefundRepository.save(returnRefund);
  }

  async deactivateReturnRefund(id: number): Promise<ReturnRefund> {
    const returnRefund = await this.findById(id);

    if (!returnRefund) {
      throw new NotFoundException(`Return Refund not found`);
    }

    returnRefund.is_active = ActiveType.NotActive;

    return await this.returnRefundRepository.save(returnRefund);
  }

  async activateReturnRefund(id: number): Promise<ReturnRefund> {
    const returnRefund = await this.findById(id);

    if (!returnRefund) {
      throw new NotFoundException(`Return Refund not found`);
    }

    returnRefund.is_active = ActiveType.Active;

    return await this.returnRefundRepository.save(returnRefund);
  }

  /**
   * this function is used to remove or delete returnRefund from database.
   * @param id is the type of number, which represent id of returnRefund
   * @returns number of rows deleted or affected
   */
  async removeReturnRefund(id: number): Promise<{ affected?: number }> {
    return this.returnRefundRepository.delete(id);
  }
}
