import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { JwtSecretKeyTMP, JwtStrategy } from 'src/auth/jwt.strategy';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from './entities/shop.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ProductModule } from 'src/product/product.module';
import { Seller } from 'src/seller/entities/seller.entity';
import { SellerService } from 'src/seller/seller.service';
import { ActivityLogService } from 'src/activity-log/activity-log.service';
import { ActivityLog } from 'src/activity-log/entities/activity-log.entity';
import { ReviewModule } from 'src/review/review.module';

@Module({
  imports: [
    AuthModule,
    ProductModule,
    ReviewModule,
    TypeOrmModule.forFeature([Shop, Seller, ActivityLog]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: JwtSecretKeyTMP,
      signOptions: { expiresIn: '3h' },
    }),
  ],
  controllers: [ShopController],
  providers: [ShopService, SellerService, ActivityLogService, JwtStrategy],
})
export class ShopModule {}
