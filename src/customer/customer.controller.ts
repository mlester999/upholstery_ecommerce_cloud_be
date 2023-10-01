import { Controller, Get } from '@nestjs/common';
import { CustomerService } from './customer.service';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('all')
  findAll() {
    return this.customerService.findAllCustomer();
  }
}
