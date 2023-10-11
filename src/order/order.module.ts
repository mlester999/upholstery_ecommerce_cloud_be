import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Seller } from 'src/seller/entities/seller.entity';
import { Product } from 'src/product/entities/product.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtSecretKeyTMP, JwtStrategy } from 'src/auth/jwt.strategy';
import { CustomerService } from 'src/customer/customer.service';
import { SellerService } from 'src/seller/seller.service';
import { ProductService } from 'src/product/product.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Order, Customer, Seller, Product]),
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
    SellerService,
    ProductService,
    JwtStrategy,
  ],
})
export class OrderModule {}
