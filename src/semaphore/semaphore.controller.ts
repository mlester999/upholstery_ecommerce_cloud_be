import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';

@Controller('semaphore')
export class SemaphoreController {
  constructor(private readonly jwtService: JwtService) {}

  @Post('send-messages')
  async sendMessages(@Body() details: any) {
    
  }

  @Post('send-otp')
  async sendOtp(@Body() body: any, @Req() request) {
    if (Object.keys(body.details).length === 0) return;

    const {contact_number} = body.details;

    try {
      const response = await axios.post(
        "https://api.semaphore.co/api/v4/otp",
        {
          number: contact_number,
          message: 'Your One Time Password is: {otp}. Please use it within 5 minutes.',
          sendername: process.env.SEMAPHORE_SENDER_NAME,
          apikey: process.env.SEMAPHORE_API_KEY,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return {sms: response.data[0].code}


    } catch (error) {
      // Handle errors
      console.error("Error sending message:", error);
    }
  }
}
