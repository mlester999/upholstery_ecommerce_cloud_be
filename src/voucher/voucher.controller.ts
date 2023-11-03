import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { VoucherService } from './voucher.service';

@Controller('voucher')
export class VoucherController {
  constructor(
    private readonly voucherService: VoucherService,
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

      return this.voucherService.findAllVoucher();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get(':voucher_id')
  async findOne(@Req() request, @Param('voucher_id') voucherId) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      return this.voucherService.findById(parseInt(voucherId));
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post(':voucher_name')
  async findOneByName(@Req() request, @Param('voucher_name') voucherName) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const voucherCode = this.voucherService.findByName(voucherName);

      if (voucherCode) {
        return voucherCode;
      } else {
        return { message: 'Invalid Voucher Code' };
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('add/new')
  async addVoucher(@Body() body: any, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      if (Object.keys(body.details).length === 0) return;

      await this.voucherService.createVoucher(body.details);

      return { message: 'Created Voucher Successfully.' };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Patch('update/:voucher_id')
  async updateVoucher(
    @Body() body: any,
    @Param('voucher_id') voucherId,
    @Req() request,
  ) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      if (Object.keys(body.details).length <= 1) return;

      const voucher = await this.voucherService.findById(voucherId);

      if (!voucher) {
        throw new BadRequestException('No Voucher Found.');
      }

      await this.voucherService.updateVoucher(
        body.details,
        parseInt(voucherId),
      );

      return { message: 'Updated voucher details successfully.' };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Patch('deactivate/:voucher_id')
  async deactivateVoucher(@Param('voucher_id') voucherId, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const voucher = await this.voucherService.findById(voucherId);

      if (!voucher) {
        throw new BadRequestException('No Voucher Found.');
      }

      await this.voucherService.deactivateVoucher(voucher.id);

      return { message: 'Deactivated voucher successfully.' };
    } catch (e) {
      if (e.response.message === 'No Voucher Found.') {
        throw new BadRequestException('No Voucher Found.');
      }
      throw new UnauthorizedException();
    }
  }

  @Patch('activate/:voucher_id')
  async activateVoucher(@Param('voucher_id') voucherId, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const voucher = await this.voucherService.findById(voucherId);

      if (!voucher) {
        throw new BadRequestException('No Voucher Found.');
      }

      await this.voucherService.activateVoucher(voucher.id);

      return { message: 'Activated voucher successfully.' };
    } catch (e) {
      if (e.response.message === 'No Voucher Found.') {
        throw new BadRequestException('No Voucher Found.');
      }
      throw new UnauthorizedException();
    }
  }
}
