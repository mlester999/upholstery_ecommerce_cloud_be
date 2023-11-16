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
import { response } from 'express';
import { UserType } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
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

      return this.adminService.findAllAdmin();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get(':admin_id')
  async findOne(@Req() request, @Param('admin_id') adminId) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      return this.adminService.findById(parseInt(adminId));
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('add')
  async addAdmin(@Body() body: any, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      if (Object.keys(body.details).length === 0) return;

      const adminEmail = await this.adminService.findByEmail(body?.details.email);

      if (adminEmail) {
        throw new BadRequestException(
          'The email address that you provided is already taken.',
        );
      }

      const adminContact = await this.adminService.findByContactNumber(
        body?.details.contact_number,
      );

      if (adminContact) {
        throw new BadRequestException(
          'The contact number that you provided is already taken.',
        );
      }

      const newUser = await this.userService.createUser(
        body.details,
        UserType.Admin,
      );

      if (!newUser) {
        throw new BadRequestException('Failed creating a user.');
      }

      await this.adminService.createAdmin(body.details, newUser);

      return { message: 'Created Admin Successfully.' };
    } catch (e) {
      if (
        e.response.message ===
        'The email address that you provided is already taken.'
      ) {
        throw new BadRequestException(
          'The email address that you provided is already taken.',
        );
      }

      if (
        e.response.message ===
        'The contact number that you provided is already taken.'
      ) {
        throw new BadRequestException(
          'The contact number that you provided is already taken.',
        );
      }
      throw new UnauthorizedException();
    }
  }

  @Patch('update/:admin_id')
  async updateAdmin(
    @Body() body: any,
    @Param('admin_id') adminId,
    @Req() request,
  ) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      if (Object.keys(body.details).length === 0) return;

      if (body?.details.email) {
        const admin = await this.adminService.findByEmail(body.details.email);

        if (admin) {
          throw new BadRequestException(
            'The email address that you provided is already taken.',
          );
        } else {
          await this.userService.updateUser(
            body.details.user_id,
            body.details.email,
          );
        }
      }

      const admin = await this.adminService.findById(body.details.id);

      if (admin.user.user_type === UserType.Admin) {
        await this.adminService.updateAdmin(body);

        return { message: 'Updated admin details successfully.' };
      }
    } catch (e) {
      if (
        e.response.message ===
        'The email address that you provided is already taken.'
      ) {
        throw new BadRequestException(
          'The email address that you provided is already taken.',
        );
      }
      throw new UnauthorizedException();
    }
  }

  @Patch('deactivate/:admin_id')
  async deactivateAdmin(@Param('admin_id') adminId, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const admin = await this.adminService.findById(adminId);

      if (!admin) {
        throw new BadRequestException('No Admin Found.');
      }

      if (admin.user.user_type === UserType.Admin) {
        await this.userService.deactivateUser(admin.user.id);

        return { message: 'Deactivated admin successfully.' };
      }
    } catch (e) {
      if (e.response.message === 'No Admin Found.') {
        throw new BadRequestException('No Admin Found.');
      }
      throw new UnauthorizedException();
    }
  }

  @Patch('activate/:admin_id')
  async activateAdmin(@Param('admin_id') adminId, @Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const admin = await this.adminService.findById(adminId);

      if (!admin) {
        throw new BadRequestException('No Admin Found.');
      }

      if (admin.user.user_type === UserType.Admin) {
        await this.userService.activateUser(admin.user.id);

        return { message: 'Activated admin successfully.' };
      }
    } catch (e) {
      if (e.response.message === 'No Admin Found.') {
        throw new BadRequestException('No Admin Found.');
      }
      throw new UnauthorizedException();
    }
  }
}
