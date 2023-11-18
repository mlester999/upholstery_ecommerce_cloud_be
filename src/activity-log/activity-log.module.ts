import { Module } from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';
import { ActivityLogController } from './activity-log.controller';
import { JwtSecretKeyTMP, JwtStrategy } from 'src/auth/jwt.strategy';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLog } from './entities/activity-log.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ShopModule } from 'src/shop/shop.module';
import { SellerModule } from 'src/seller/seller.module';
import { ProductModule } from 'src/product/product.module';
import { OrderModule } from 'src/order/order.module';
import { CustomerModule } from 'src/customer/customer.module';
import { ReturnRefundModule } from 'src/return-refund/return-refund.module';
import { BankAccountsModule } from 'src/bank-accounts/bank-accounts.module';
import { SellerBalanceModule } from 'src/seller-balance/seller-balance.module';

@Module({
  imports: [
    AuthModule,
    ShopModule,
    CustomerModule,
    SellerModule,
    ProductModule,
    OrderModule,
    ReturnRefundModule,
    BankAccountsModule,
    SellerBalanceModule,
    TypeOrmModule.forFeature([ActivityLog]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: JwtSecretKeyTMP,
      signOptions: { expiresIn: '3h' },
    }),
  ],
  controllers: [ActivityLogController],
  providers: [ActivityLogService, JwtStrategy],
})
export class ActivityLogModule {}
