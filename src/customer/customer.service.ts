import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { User } from 'src/user/entities/user.entity';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomerService {
  /**
   * Here, we have used data mapper approch for this tutorial that is why we
   * injecting repository here. Another approch can be Active records.
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

    customer.user = user;
    customer.first_name = createCustomerDto.first_name;
    customer.middle_name = createCustomerDto.middle_name;
    customer.last_name = createCustomerDto.last_name;
    customer.gender = createCustomerDto.gender;
    customer.birth_date = createCustomerDto.birth_date;
    customer.contact_number = createCustomerDto.contact_number;
    customer.region = createCustomerDto.region;
    customer.province = createCustomerDto.province;
    customer.city = createCustomerDto.city;
    customer.barangay = createCustomerDto.barangay;
    customer.postal_code = createCustomerDto.postal_code;
    customer.street_name = createCustomerDto.street_name;

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
    return this.customerRepository.findOneBy({ id });
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param id is type of number, which represent the id of user.
   * @returns promise of user
   */
  async viewCustomer(id: number): Promise<Customer> {
    return this.customerRepository.findOneBy({ id });
  }

  /**
   * this function is used to updated specific user whose id is passed in
   * parameter along with passed updated data
   * @param id is type of number, which represent the id of user.
   * @param updateUserDto this is partial type of createUserDto.
   * @returns promise of udpate user
   */
  async updateCustomer(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const customer: Customer = new Customer();

    customer.first_name = updateCustomerDto.first_name;
    customer.middle_name = updateCustomerDto.middle_name;
    customer.last_name = updateCustomerDto.last_name;
    customer.gender = updateCustomerDto.gender;
    customer.birth_date = updateCustomerDto.birth_date;
    customer.contact_number = updateCustomerDto.contact_number;
    customer.region = updateCustomerDto.region;
    customer.province = updateCustomerDto.province;
    customer.city = updateCustomerDto.city;
    customer.barangay = updateCustomerDto.barangay;
    customer.postal_code = updateCustomerDto.postal_code;
    customer.street_name = updateCustomerDto.street_name;
    customer.id = id;
    return this.customerRepository.save(customer);
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
