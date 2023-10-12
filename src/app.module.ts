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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'tw0t0w3rs',
      entities: [
        User,
        Admin,
        Customer,
        Seller,
        Category,
        Product,
        Order,
        Voucher,
        Shop,
      ],
      database: 'upholstery-ecommerce',
      synchronize: true,
      logging: true,
    }),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
