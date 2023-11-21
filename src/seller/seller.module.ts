import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from './entities/seller.entity';
import { User } from 'src/user/entities/user.entity';
import { JwtSecretKeyTMP, JwtStrategy } from 'src/auth/jwt.strategy';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ProductModule } from 'src/product/product.module';
import { ShopModule } from 'src/shop/shop.module';
import { ActivityLogService } from 'src/activity-log/activity-log.service';
import { ActivityLog } from 'src/activity-log/entities/activity-log.entity';

@Module({
  imports: [
    AuthModule,
    ProductModule,
    ShopModule,
    TypeOrmModule.forFeature([Seller, User, ActivityLog]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: JwtSecretKeyTMP,
      signOptions: { expiresIn: '3h' },
    }),
  ],
  controllers: [SellerController],
  providers: [SellerService, UserService, ActivityLogService, JwtStrategy],
})
export class SellerModule {}
