import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Shop } from 'src/shop/entities/shop.entity';
import { Product } from 'src/product/entities/product.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtSecretKeyTMP, JwtStrategy } from 'src/auth/jwt.strategy';
import { CustomerService } from 'src/customer/customer.service';
import { ShopService } from 'src/shop/shop.service';
import { ProductService } from 'src/product/product.service';
import { ActivityLogService } from 'src/activity-log/activity-log.service';
import { ActivityLog } from 'src/activity-log/entities/activity-log.entity';
import { ReturnRefundModule } from 'src/return-refund/return-refund.module';
import { SellerBalanceService } from 'src/seller-balance/seller-balance.service';
import { SellerBalance } from 'src/seller-balance/entities/seller-balance.entity';

@Module({
  imports: [
    AuthModule,
    ReturnRefundModule,
    TypeOrmModule.forFeature([Order, Customer, Shop, Product, SellerBalance, ActivityLog]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: JwtSecretKeyTMP,
      signOptions: { expiresIn: '3h' },
    }),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    CustomerService,
    ShopService,
    ProductService,
    SellerBalanceService,
    ActivityLogService,
    JwtStrategy,
  ],
})
export class OrderModule {}
