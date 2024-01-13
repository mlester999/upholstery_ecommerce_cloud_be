import { Controller, Get, Req } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { AppService } from './app.service';
import { JwtGuard } from './auth/guards';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtGuard)
  @Get('/login')
  getHello(@Req() req): string {
    return this.appService.getHello();
  }

  @Get('/public/login')
  publicGetHello(@Req() req): string {
    return this.appService.getHello();
  }
}
