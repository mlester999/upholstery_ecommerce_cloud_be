import { Module } from '@nestjs/common';
import { SellerBalanceService } from './seller-balance.service';
import { SellerBalanceController } from './seller-balance.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtSecretKeyTMP, JwtStrategy } from 'src/auth/jwt.strategy';
import { SellerBalance } from './entities/seller-balance.entity';
import { Product } from 'src/product/entities/product.entity';
import { ActivityLog } from 'src/activity-log/entities/activity-log.entity';
import { ProductService } from 'src/product/product.service';
import { ActivityLogService } from 'src/activity-log/activity-log.service';
import { ShopService } from 'src/shop/shop.service';
import { Shop } from 'src/shop/entities/shop.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([SellerBalance, Shop, Product, ActivityLog]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: JwtSecretKeyTMP,
      signOptions: { expiresIn: '3h' },
    }),
  ],
  controllers: [SellerBalanceController],
  providers: [SellerBalanceService, ShopService, ProductService, ActivityLogService, JwtStrategy],
})
export class SellerBalanceModule {}
