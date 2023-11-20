import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seller } from 'src/seller/entities/seller.entity';
import { ActiveType } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { BankAccount } from './entities/bank-account.entity';

@Injectable()
export class BankAccountsService {
  /**
   * Here, we have used data mapper approach for this tutorial that is why we
   * injecting repository here. Another approach can be Active records.
   */
  constructor(
    @InjectRepository(BankAccount)
    private readonly bankAccountRepository: Repository<BankAccount>,
  ) {}

  /**
   * this is function is used to create Bank Account in Bank Account Entity.
   * @param createBankAccountDto this will type of createBankAccountDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of bankAccount
   */
  async createBankAccount(
    createBankAccountDto: CreateBankAccountDto,
    seller: Seller,
  ): Promise<BankAccount> {
    const bankAccount: BankAccount = new BankAccount();

    bankAccount.seller = seller;
    bankAccount.name = createBankAccountDto.name;
    bankAccount.contact_number = createBankAccountDto.contact_number;
    bankAccount.contact_number_verified_at = new Date();
    bankAccount.is_active = ActiveType.Active;

    return this.bankAccountRepository.save(bankAccount);
  }

  async createUnverifiedBankAccount(
    createBankAccountDto: CreateBankAccountDto,
    seller: Seller,
  ): Promise<BankAccount> {
    const bankAccount: BankAccount = new BankAccount();

    bankAccount.seller = seller;
    bankAccount.name = createBankAccountDto.name;
    bankAccount.contact_number = createBankAccountDto.contact_number;
    bankAccount.is_active = ActiveType.Active;

    return this.bankAccountRepository.save(bankAccount);
  }

  /**
   * this function is used to get all the bankAccount's list
   * @returns promise of array of bankAccounts
   */
  async findAllBankAccount(): Promise<BankAccount[]> {
    return this.bankAccountRepository.find({
      relations: {
        seller: true,
      },
    });
  }

  async findById(id: number): Promise<BankAccount | undefined> {
    return this.bankAccountRepository.findOne({
      where: { id },
      relations: {
        seller: true,
      },
    });
  }

  async findBySlug(slug: string): Promise<BankAccount | undefined> {
    return this.bankAccountRepository.findOne({
      where: { name: slug },
      relations: {
        seller: true,
      },
    });
  }

  async findBySellerId(id: number): Promise<BankAccount | undefined> {
    return this.bankAccountRepository.findOne({
      where: {
        seller: {
          id,
        },
        is_active: 1,
      },
      relations: {
        seller: true,
      },
    });
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param id is type of number, which represent the id of bankAccount.
   * @returns promise of bankAccount
   */
  async viewBankAccount(id: number): Promise<BankAccount> {
    return this.bankAccountRepository.findOneBy({ id });
  }

  /**
   * this function is used to updated specific bankAccount whose id is passed in
   * parameter along with passed updated data
   * @param id is type of number, which represent the id of bankAccount.
   * @param updateBankAccountDto this is partial type of createBankAccountDto.
   * @returns promise of update bankAccount
   */
  async updateBankAccount(body: any, id: number, seller: Seller): Promise<BankAccount> {
    const bankAccount = await this.findById(
      id,
    );

    if (!bankAccount) {
      throw new NotFoundException(`Bank Account not found`);
    }

    if (seller) {
      bankAccount.seller = seller;
    }

    if (body.details.name) {
      bankAccount.name = body.details.name;
    }

    if (body.details.contact_number) {
      bankAccount.contact_number = body.details.contact_number;
    }

    if (body.details.is_active) {
      bankAccount.is_active = body.details.is_active;
    }

    return await this.bankAccountRepository.save(bankAccount);
  }

  async deactivateBankAccount(id: number): Promise<BankAccount> {
    const bankAccount = await this.findById(id);

    if (!bankAccount) {
      throw new NotFoundException(`Bank Account not found`);
    }

    bankAccount.is_active = ActiveType.NotActive;

    return await this.bankAccountRepository.save(bankAccount);
  }

  async activateBankAccount(id: number): Promise<BankAccount> {
    const bankAccount = await this.findById(id);

    if (!bankAccount) {
      throw new NotFoundException(`Bank Account not found`);
    }

    bankAccount.is_active = ActiveType.Active;

    return await this.bankAccountRepository.save(bankAccount);
  }

  /**
   * this function is used to remove or delete bankAccount from database.
   * @param id is the type of number, which represent id of bankAccount
   * @returns number of rows deleted or affected
   */
  async removeBankAccount(id: number): Promise<{ affected?: number }> {
    return this.bankAccountRepository.delete(id);
  }
}
