import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { ShopService } from 'src/shop/shop.service';
import { CustomerService } from 'src/customer/customer.service';
import { JwtSecretKeyTMP, JwtStrategy } from 'src/auth/jwt.strategy';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Notification } from './entities/notification.entity';
import { Shop } from 'src/shop/entities/shop.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Follow } from 'src/follow/entities/follow.entity';
import { FollowService } from 'src/follow/follow.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Notification, Shop, Customer, Follow]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: JwtSecretKeyTMP,
      signOptions: { expiresIn: '3h' },
    }),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, ShopService, CustomerService, FollowService, JwtStrategy],
})
export class NotificationModule {}
