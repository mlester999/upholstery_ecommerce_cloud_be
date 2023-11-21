import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UnauthorizedException } from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { UpdateActivityLogDto } from './dto/update-activity-log.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('activity-log')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService, private readonly jwtService: JwtService) {}

  @Get('all')
  async findAll(@Req() request) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      return this.activityLogService.findAllActivityLog();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get(':activity_log_id')
  async findOne(@Req() request, @Param('activity_log_id') activityLogId) {
    try {
      const cookie = request.cookies['user_token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      return this.activityLogService.findById(parseInt(activityLogId));
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
