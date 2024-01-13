import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { Admin } from './admin/entities/admin.entity';
import { CustomerModule } from './customer/customer.module';
import { Customer } from './customer/entities/customer.entity';
import { SellerModule } from './seller/seller.module';
import { Seller } from './seller/entities/seller.entity';
import { CategoryModule } from './category/category.module';
import { Category } from './category/entities/category.entity';
import { ProductModule } from './product/product.module';
import { Product } from './product/entities/product.entity';
import { MulterModule } from '@nestjs/platform-express/multer';
import { join } from 'path';
import { OrderModule } from './order/order.module';
import { Order } from './order/entities/order.entity';
import { VoucherModule } from './voucher/voucher.module';
import { Voucher } from './voucher/entities/voucher.entity';
import { ShopModule } from './shop/shop.module';
import { Shop } from './shop/entities/shop.entity';
import { PaymongoModule } from './paymongo/paymongo.module';
import { ActivityLogModule } from './activity-log/activity-log.module';
import { ActivityLog } from './activity-log/entities/activity-log.entity';
import { ReturnRefundModule } from './return-refund/return-refund.module';
import { ReturnRefund } from './return-refund/entities/return-refund.entity';
import { SemaphoreModule } from './semaphore/semaphore.module';
import { ConfigModule } from '@nestjs/config';
import { BankAccountsModule } from './bank-accounts/bank-accounts.module';
import { SellerBalanceModule } from './seller-balance/seller-balance.module';
import { BankAccount } from './bank-accounts/entities/bank-account.entity';
import { SellerBalance } from './seller-balance/entities/seller-balance.entity';
import { SellerWithdrawalModule } from './seller-withdrawal/seller-withdrawal.module';
import { SellerWithdrawal } from './seller-withdrawal/entities/seller-withdrawal.entity';
import { ReviewModule } from './review/review.module';
import { Review } from './review/entities/review.entity';
import { NotificationModule } from './notification/notification.module';
import { FollowModule } from './follow/follow.module';
import { Follow } from './follow/entities/follow.entity';
import { Notification } from './notification/entities/notification.entity';
import { SellerNotificationModule } from './seller-notification/seller-notification.module';
import { SellerNotification } from './seller-notification/entities/seller-notification.entity';
import { dataSourceOptions } from './db/ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOptions),
    MulterModule.register({
      dest: join(__dirname, '../../../frontend/public/assets'),
    }),
    UserModule,
    AuthModule,
    AdminModule,
    CustomerModule,
    SellerModule,
    CategoryModule,
    ProductModule,
    OrderModule,
    VoucherModule,
    ShopModule,
    PaymongoModule,
    ActivityLogModule,
    ReturnRefundModule,
    SemaphoreModule,
    BankAccountsModule,
    SellerBalanceModule,
    SellerWithdrawalModule,
    ReviewModule,
    NotificationModule,
    FollowModule,
    SellerNotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
