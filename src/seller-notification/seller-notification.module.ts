import { Module } from '@nestjs/common';
import { SellerNotificationService } from './seller-notification.service';
import { SellerNotificationController } from './seller-notification.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'src/admin/entities/admin.entity';
import { Seller } from 'src/seller/entities/seller.entity';
import { Follow } from 'src/follow/entities/follow.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtSecretKeyTMP } from 'src/auth/jwt.strategy';
import { AdminService } from 'src/admin/admin.service';
import { SellerService } from 'src/seller/seller.service';
import { FollowService } from 'src/follow/follow.service';
import { SellerNotification } from './entities/seller-notification.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([SellerNotification, Admin, Seller, Follow]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: JwtSecretKeyTMP,
      signOptions: { expiresIn: '3h' },
    }),
  ],
  controllers: [SellerNotificationController],
  providers: [SellerNotificationService, AdminService, SellerService, FollowService],
})
export class SellerNotificationModule {}
