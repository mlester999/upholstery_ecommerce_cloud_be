import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { User } from 'src/user/entities/user.entity';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomerService {
  /**
   * Here, we have used data mapper approach for this tutorial that is why we
   * injecting repository here. Another approach can be Active records.
   */
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  /**
   * this is function is used to create Customer in Customer Entity.
   * @param createCustomerDto this will type of createCustomerDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of customer
   */
  async createCustomer(
    createCustomerDto: CreateCustomerDto,
    user: User,
  ): Promise<Customer> {
    const customer: Customer = new Customer();

    const originalDate = new Date(createCustomerDto.birth_date);

    customer.user = user;
    customer.first_name = createCustomerDto.first_name;
    customer.middle_name = createCustomerDto.middle_name;
    customer.last_name = createCustomerDto.last_name;
    customer.gender = createCustomerDto.gender;
    customer.birth_date = originalDate;
    customer.contact_number = createCustomerDto.contact_number;
    customer.region = createCustomerDto.region;
    customer.province = createCustomerDto.province;
    customer.city = createCustomerDto.city;
    customer.barangay = createCustomerDto.barangay;
    customer.zip_code = createCustomerDto.zip_code;
    customer.street_address = createCustomerDto.street_address;

    return this.customerRepository.save(customer);
  }

  /**
   * this function is used to get all the user's list
   * @returns promise of array of users
   */
  async findAllCustomer(): Promise<Customer[]> {
    return this.customerRepository.find({
      relations: {
        user: true,
      },
    });
  }

  async findById(id: number): Promise<Customer | undefined> {
    return this.customerRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });
  }

  async findByEmail(email: string): Promise<Customer | undefined> {
    return this.customerRepository.findOne({
      where: { user: { email } },
      relations: {
        user: true,
      },
    });
  }

  async findByContactNumber(contact_number: string): Promise<Customer | undefined> {
    return this.customerRepository.findOne({
      where: { contact_number }
    });
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param id is type of number, which represent the id of user.
   * @returns promise of user
   */
  async viewCustomer(id: number): Promise<Customer> {
    return this.customerRepository.findOneBy({ id });
  }

  async verifyPhoneNumber(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOneBy({
      id,
    });

    if (!customer) {
      throw new NotFoundException(`Customer not found`);
    }

    customer.contact_number_verified_at = new Date();

    return await this.customerRepository.save(customer);
  }

  /**
   * this function is used to updated specific user whose id is passed in
   * parameter along with passed updated data
   * @param id is type of number, which represent the id of user.
   * @param updateUserDto this is partial type of createUserDto.
   * @returns promise of udpate user
   */
  async updateCustomer(body: any): Promise<Customer> {
    const customer = await this.customerRepository.findOneBy({
      id: body.details.id,
    });

    if (!customer) {
      throw new NotFoundException(`Customer not found`);
    }

    if (Object.keys(body.details).length <= 1 && body.details.email) return;

    if (body.details.first_name) {
      customer.first_name = body.details.first_name;
    }

    if (body.details.middle_name || body.details.middle_name === '') {
      customer.middle_name = body.details.middle_name;
    }

    if (body.details.last_name) {
      customer.last_name = body.details.last_name;
    }

    if (body.details.gender) {
      customer.gender = body.details.gender;
    }

    if (body.details.birth_date) {
      const originalDate = new Date(body.details.birth_date);

      customer.birth_date = originalDate;
    }

    if (body.details.contact_number) {
      customer.contact_number = body.details.contact_number;
    }

    if (body.details.region) {
      customer.region = body.details.region;
    }

    if (body.details.province) {
      customer.province = body.details.province;
    }

    if (body.details.city) {
      customer.city = body.details.city;
    }

    if (body.details.barangay) {
      customer.barangay = body.details.barangay;
    }

    if (body.details.zip_code) {
      customer.zip_code = body.details.zip_code;
    }

    if (body.details.street_address) {
      customer.street_address = body.details.street_address;
    }

    return await this.customerRepository.save(customer);
  }

  /**
   * this function is used to remove or delete user from database.
   * @param id is the type of number, which represent id of user
   * @returns nuber of rows deleted or affected
   */
  async removeCustomer(id: number): Promise<{ affected?: number }> {
    return this.customerRepository.delete(id);
  }
}
