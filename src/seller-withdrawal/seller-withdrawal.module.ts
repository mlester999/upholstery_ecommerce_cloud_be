import { Module } from '@nestjs/common';
import { SellerWithdrawalService } from './seller-withdrawal.service';
import { SellerWithdrawalController } from './seller-withdrawal.controller';
import { SellerBalanceService } from 'src/seller-balance/seller-balance.service';
import { ActivityLogService } from 'src/activity-log/activity-log.service';
import { JwtSecretKeyTMP, JwtStrategy } from 'src/auth/jwt.strategy';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { SellerBalance } from 'src/seller-balance/entities/seller-balance.entity';
import { ActivityLog } from 'src/activity-log/entities/activity-log.entity';
import { SellerWithdrawal } from './entities/seller-withdrawal.entity';
import { Seller } from 'src/seller/entities/seller.entity';
import { SellerService } from 'src/seller/seller.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([SellerWithdrawal, SellerBalance, Seller, ActivityLog]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: JwtSecretKeyTMP,
      signOptions: { expiresIn: '3h' },
    }),
  ],
  controllers: [SellerWithdrawalController],
  providers: [SellerWithdrawalService, SellerService, SellerBalanceService, ActivityLogService, JwtStrategy],
})
export class SellerWithdrawalModule {}
