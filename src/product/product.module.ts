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
import { Seller } from 'src/seller/entities/seller.entity';
import { CategoryService } from 'src/category/category.service';
import { SellerService } from 'src/seller/seller.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Product, Category, Seller]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: JwtSecretKeyTMP,
      signOptions: { expiresIn: '3h' },
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService, CategoryService, SellerService, JwtStrategy],
})
export class ProductModule {}
