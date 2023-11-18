import {
  Body,
  Controller,
  Get,
  Ip,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { SellerService } from 'src/seller/seller.service';
import { ActivityLogService } from 'src/activity-log/activity-log.service';
import { BankAccountsService } from './bank-accounts.service';

@Controller('bank-accounts')
export class BankAccountsController {
  constructor(
    private readonly bankAccountsService: BankAccountsService,
    private readonly sellerService: SellerService,
    private readonly activityLogService: ActivityLogService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('all')
  async findAll(@Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      return this.bankAccountsService.findAllBankAccount();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get(':bank_account_id')
  async findOne(@Req() request, @Param('bank_account_id') bankAccountId) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      return this.bankAccountsService.findById(Number(bankAccountId));
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get('/slug/:bank_account_slug')
  async findOneBySlug(@Req() request, @Param('bank_account_slug') bankAccountSlug) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      return this.bankAccountsService.findBySlug(bankAccountSlug);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('add')
  async addBankAccount(@Body() body: any, @Req() request, @Ip() ip) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      if (Object.keys(body.details).length === 0) return;

      const seller = await this.sellerService.findById(Number(body.details.seller_id));

      if (!seller) {
        throw new BadRequestException('No Seller Found.');
      }

      const hasExistingBankAccount = await this.bankAccountsService.findBySellerId(Number(seller.id));

      if (hasExistingBankAccount) {
        throw new BadRequestException(
          'Seller has already existing bank account. You can deactivate the existing bank account and create a new one.',
        );
      }

      const createdBankAccount = await this.bankAccountsService.createBankAccount(body.details, seller);

      await this.activityLogService.createActivityLog({title: 'add-bank-account', description: `A seller named ${createdBankAccount.seller.first_name} ${createdBankAccount.seller.last_name} addded a bank account for its shop.`, ip_address: ip});

      return { message: 'Added Bank Account Successfully.' };
    } catch (e) {
      if (
        e.response.message ===
        'Seller has already existing bank account. You can deactivate the existing bank account and create a new one.'
      ) {
        throw new BadRequestException(
          'Seller has already existing bank account. You can deactivate the existing bank account and create a new one.',
        );
      }
      throw new UnauthorizedException();
    }
  }

  @Patch('update/:bank_account_id')
  async updateBankAccount(
    @Body() body: any,
    @Param('bank_account_id') bankAccountId,
    @Req() request,
    @Ip() ip
  ) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      if (Object.keys(body.details).length === 0) return;

     
      const bankAccount = await this.bankAccountsService.findById(bankAccountId);

      if (!bankAccount) {
        throw new BadRequestException('No Bank Account Found.');
      }

      const seller = await this.sellerService.findById(bankAccount.seller.id);

      if (!seller) {
        throw new BadRequestException('No Seller Found.');
      }

      const hasExistingBankAccount = await this.bankAccountsService.findBySellerId(
        bankAccount.seller.id,
      );

      if (hasExistingBankAccount && body.details.id !== hasExistingBankAccount.id && body.details.is_active) {
        throw new BadRequestException(
          'Seller has already existing bank account. You can deactivate the existing bank account and create a new one.',
        );
      }

      const updatedBankAccount = await this.bankAccountsService.updateBankAccount(body, bankAccountId, seller);

      await this.activityLogService.createActivityLog({title: 'update-bank-account', description: `A seller named ${updatedBankAccount.seller.first_name} ${updatedBankAccount.seller.last_name} has updated its bank account.`, ip_address: ip});

      return { message: 'Updated Bank Account Successfully.' };
    } catch (e) {
      if (
        e.response.message ===
        'Seller has already existing bank account. You can deactivate the existing bank account and create a new one.'
      ) {
        throw new BadRequestException(
          'Seller has already existing bank account. You can deactivate the existing bank account and create a new one.',
        );
      }
      throw new UnauthorizedException();
    }
  }

  @Patch('deactivate/:bank_account_id')
  async deactivateBankAccount(@Param('bank_account_id') bankAccountId, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const bankAccount = await this.bankAccountsService.findById(Number(bankAccountId));

      if (!bankAccount) {
        throw new BadRequestException('No Bank Account Found.');
      }

      await this.bankAccountsService.deactivateBankAccount(Number(bankAccount.id));

      return { message: 'Deactivated Bank Account Successfully.' };
    } catch (e) {
      if (e.response.message === 'No Bank Account Found.') {
        throw new BadRequestException('No Bank Account Found.');
      }
      throw new UnauthorizedException();
    }
  }

  @Patch('activate/:bank_account_id')
  async activateBankAccount(@Param('bank_account_id') bankAccountId, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const bankAccount = await this.bankAccountsService.findById(Number(bankAccountId));

      if (!bankAccount) {
        throw new BadRequestException('No Bank Account Found.');
      }

      await this.bankAccountsService.activateBankAccount(Number(bankAccount.id));

      return { message: 'Activated Bank Account Successfully.' };
    } catch (e) {
      if (e.response.message === 'No Bank Account Found.') {
        throw new BadRequestException('No Bank Account Found.');
      }
      throw new UnauthorizedException();
    }
  }
}
