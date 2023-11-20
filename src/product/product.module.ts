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

@Module({
  imports: [
    AuthModule,
    ReturnRefundModule,
    ReviewModule,
    TypeOrmModule.forFeature([Product, Category, Shop, ActivityLog]),
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
    ActivityLogService,
    JwtStrategy,
  ],
})
export class ProductModule {}
