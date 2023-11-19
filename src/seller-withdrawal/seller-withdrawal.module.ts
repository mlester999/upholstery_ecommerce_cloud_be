import { Module } from '@nestjs/common';
import { SellerWithdrawalService } from './seller-withdrawal.service';
import { SellerWithdrawalController } from './seller-withdrawal.controller';
import { SellerBalanceService } from 'src/seller-balance/seller-balance.service';
import { ShopService } from 'src/shop/shop.service';
import { ActivityLogService } from 'src/activity-log/activity-log.service';
import { JwtSecretKeyTMP, JwtStrategy } from 'src/auth/jwt.strategy';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { SellerBalance } from 'src/seller-balance/entities/seller-balance.entity';
import { Shop } from 'src/shop/entities/shop.entity';
import { ActivityLog } from 'src/activity-log/entities/activity-log.entity';
import { SellerWithdrawal } from './entities/seller-withdrawal.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([SellerWithdrawal, SellerBalance, Shop, ActivityLog]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: JwtSecretKeyTMP,
      signOptions: { expiresIn: '3h' },
    }),
  ],
  controllers: [SellerWithdrawalController],
  providers: [SellerWithdrawalService, ShopService, SellerBalanceService, ActivityLogService, JwtStrategy],
})
export class SellerWithdrawalModule {}
