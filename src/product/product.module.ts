import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtSecretKeyTMP, JwtStrategy } from 'src/auth/jwt.strategy';
import { Category } from 'src/category/entities/category.entity';
import { Product } from './entities/product.entity';
import { CategoryService } from 'src/category/category.service';
import { ShopService } from 'src/shop/shop.service';
import { Shop } from 'src/shop/entities/shop.entity';
import { DoSpacesServiceProvider } from 'src/spaces-module/spaces-service';
import { DoSpacesService } from 'src/spaces-module/spaces-service/doSpacesService';
import { ActivityLogService } from 'src/activity-log/activity-log.service';
import { ActivityLog } from 'src/activity-log/entities/activity-log.entity';
import { ReturnRefundModule } from 'src/return-refund/return-refund.module';
import { ReviewModule } from 'src/review/review.module';
import { Notification } from 'src/notification/entities/notification.entity';
import { NotificationService } from 'src/notification/notification.service';
import { Follow } from 'src/follow/entities/follow.entity';
import { FollowService } from 'src/follow/follow.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Seller } from 'src/seller/entities/seller.entity';
import { SellerService } from 'src/seller/seller.service';

@Module({
  imports: [
    AuthModule,
    ReturnRefundModule,
    ReviewModule,
    TypeOrmModule.forFeature([Product, Category, Shop, Follow, Notification, User, Seller, ActivityLog]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: JwtSecretKeyTMP,
      signOptions: { expiresIn: '3h' },
    }),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    CategoryService,
    ShopService,
    DoSpacesServiceProvider,
    DoSpacesService,
    FollowService,
    NotificationService,
    UserService,
    SellerService,
    ActivityLogService,
    JwtStrategy,
  ],
})
export class ProductModule {}
