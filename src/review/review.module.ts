import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtSecretKeyTMP, JwtStrategy } from 'src/auth/jwt.strategy';
import { Review } from './entities/review.entity';
import { Shop } from 'src/shop/entities/shop.entity';
import { Product } from 'src/product/entities/product.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { ActivityLog } from 'src/activity-log/entities/activity-log.entity';
import { ShopService } from 'src/shop/shop.service';
import { ProductService } from 'src/product/product.service';
import { CustomerService } from 'src/customer/customer.service';
import { ActivityLogService } from 'src/activity-log/activity-log.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Review, Shop, Product, Customer, ActivityLog]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: JwtSecretKeyTMP,
      signOptions: { expiresIn: '3h' },
    }),
  ],
  controllers: [ReviewController],
  providers: [ReviewService, ShopService, ProductService, CustomerService, ActivityLogService, JwtStrategy],
})
export class ReviewModule {}
