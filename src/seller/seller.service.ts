import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { User } from 'src/user/entities/user.entity';
import { Seller } from './entities/seller.entity';

@Injectable()
export class SellerService {
  /**
   * Here, we have used data mapper approach for this tutorial that is why we
   * injecting repository here. Another approach can be Active records.
   */
  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
  ) {}

  /**
   * this is function is used to create Seller in Seller Entity.
   * @param createSellerDto this will type of createSellerDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of seller
   */
  async createSeller(
    createSellerDto: CreateSellerDto,
    user: User,
  ): Promise<Seller> {
    const seller: Seller = new Seller();

    const originalDate = new Date(createSellerDto.birth_date);

    seller.user = user;
    seller.first_name = createSellerDto.first_name;
    seller.middle_name = createSellerDto.middle_name;
    seller.last_name = createSellerDto.last_name;
    seller.gender = createSellerDto.gender;
    seller.birth_date = originalDate;
    seller.contact_number = createSellerDto.contact_number;
    seller.region = createSellerDto.region;
    seller.province = createSellerDto.province;
    seller.city = createSellerDto.city;
    seller.barangay = createSellerDto.barangay;
    seller.zip_code = createSellerDto.zip_code;
    seller.street_address = createSellerDto.street_address;

    return this.sellerRepository.save(seller);
  }

  /**
   * this function is used to get all the user's list
   * @returns promise of array of users
   */
  async findAllSeller(): Promise<Seller[]> {
    return this.sellerRepository.find({
      relations: {
        user: true,
      },
    });
  }

  async findById(id: number): Promise<Seller | undefined> {
    return this.sellerRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });
  }

  async findByEmail(email: string): Promise<Seller | undefined> {
    return this.sellerRepository.findOne({
      where: { user: { email } },
      relations: {
        user: true,
      },
    });
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param id is type of number, which represent the id of user.
   * @returns promise of user
   */
  async viewSeller(id: number): Promise<Seller> {
    return this.sellerRepository.findOneBy({ id });
  }

  /**
   * this function is used to updated specific user whose id is passed in
   * parameter along with passed updated data
   * @param id is type of number, which represent the id of user.
   * @param updateUserDto this is partial type of createUserDto.
   * @returns promise of update user
   */
  async updateSeller(body: any, id: number): Promise<Seller> {
    const seller = await this.sellerRepository.findOneBy({
      id,
    });

    if (!seller) {
      throw new NotFoundException(`Seller not found`);
    }

    if (Object.keys(body.details).length <= 1 && body.details.email) return;

    if (body.details.first_name) {
      seller.first_name = body.details.first_name;
    }

    if (body.details.middle_name || body.details.middle_name === '') {
      seller.middle_name = body.details.middle_name;
    }

    if (body.details.last_name) {
      seller.last_name = body.details.last_name;
    }

    if (body.details.gender) {
      seller.gender = body.details.gender;
    }

    if (body.details.birth_date) {
      const originalDate = new Date(body.details.birth_date);

      seller.birth_date = originalDate;
    }

    if (body.details.contact_number) {
      seller.contact_number = body.details.contact_number;
    }

    if (body.details.region) {
      seller.region = body.details.region;
    }

    if (body.details.province) {
      seller.province = body.details.province;
    }

    if (body.details.city) {
      seller.city = body.details.city;
    }

    if (body.details.barangay) {
      seller.barangay = body.details.barangay;
    }

    if (body.details.zip_code) {
      seller.zip_code = body.details.zip_code;
    }

    if (body.details.street_address) {
      seller.street_address = body.details.street_address;
    }

    return await this.sellerRepository.save(seller);
  }

  /**
   * this function is used to remove or delete user from database.
   * @param id is the type of number, which represent id of user
   * @returns number of rows deleted or affected
   */
  async removeSeller(id: number): Promise<{ affected?: number }> {
    return this.sellerRepository.delete(id);
  }
}
