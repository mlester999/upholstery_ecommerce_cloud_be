import { randomUuid } from '../../utils/generateUuid';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveType } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { Voucher } from './entities/voucher.entity';

@Injectable()
export class VoucherService {
  /**
   * Here, we have used data mapper approach for this tutorial that is why we
   * injecting repository here. Another approach can be Active records.
   */
  constructor(
    @InjectRepository(Voucher)
    private readonly voucherRepository: Repository<Voucher>,
  ) {}

  /**
   * this is function is used to create Voucher in Voucher Entity.
   * @param createVoucherDto this will type of createVoucherDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of voucher
   */
  async createVoucher(createVoucherDto: CreateVoucherDto): Promise<Voucher> {
    const voucher: Voucher = new Voucher();

    voucher.voucher_id = randomUuid(14, 'ALPHANUM');
    voucher.voucher_code = createVoucherDto.voucher_code;
    voucher.title = createVoucherDto.title;
    voucher.description = createVoucherDto.description;
    voucher.amount = createVoucherDto.amount;
    voucher.mode = createVoucherDto.mode;
    voucher.type = createVoucherDto.type;
    voucher.is_active = ActiveType.Active;

    return this.voucherRepository.save(voucher);
  }

  /**
   * this function is used to get all the voucher's list
   * @returns promise of array of vouchers
   */
  async findAllVoucher(): Promise<Voucher[]> {
    return this.voucherRepository.find();
  }

  async findById(id: number): Promise<Voucher | undefined> {
    return this.voucherRepository.findOne({
      where: { id },
    });
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param id is type of number, which represent the id of voucher.
   * @returns promise of voucher
   */
  async viewVoucher(id: number): Promise<Voucher> {
    return this.voucherRepository.findOneBy({ id });
  }

  /**
   * this function is used to updated specific voucher whose id is passed in
   * parameter along with passed updated data
   * @param id is type of number, which represent the id of voucher.
   * @param updateVoucherDto this is partial type of createVoucherDto.
   * @returns promise of update voucher
   */
  async updateVoucher(details: any, id: number): Promise<Voucher> {
    const voucher = await this.voucherRepository.findOneBy({
      id,
    });

    if (!voucher) {
      throw new NotFoundException(`Voucher not found`);
    }

    if (details.voucher_code) {
      voucher.voucher_code = details.voucher_code;
    }

    if (details.title) {
      voucher.title = details.title;
    }

    if (details.description) {
      voucher.description = details.description;
    }

    if (details.amount) {
      voucher.amount = details.amount;
    }

    if (details.mode) {
      voucher.mode = details.mode;
    }

    if (details.type) {
      voucher.type = details.type;
    }

    return await this.voucherRepository.save(voucher);
  }

  async deactivateVoucher(id: number): Promise<Voucher> {
    const voucher = await this.findById(id);

    if (!voucher) {
      throw new NotFoundException(`Voucher not found`);
    }

    voucher.is_active = ActiveType.NotActive;

    return await this.voucherRepository.save(voucher);
  }

  async activateVoucher(id: number): Promise<Voucher> {
    const voucher = await this.findById(id);

    if (!voucher) {
      throw new NotFoundException(`Voucher not found`);
    }

    voucher.is_active = ActiveType.Active;

    return await this.voucherRepository.save(voucher);
  }

  /**
   * this function is used to remove or delete voucher from database.
   * @param id is the type of number, which represent id of voucher
   * @returns number of rows deleted or affected
   */
  async removeVoucher(id: number): Promise<{ affected?: number }> {
    return this.voucherRepository.delete(id);
  }
}
