import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport/dist';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtSecretKeyTMP, JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AppService } from 'src/app.service';
import { User } from 'src/user/entities/user.entity';
import { AdminService } from 'src/admin/admin.service';
import { Admin } from 'src/admin/entities/admin.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { CustomerService } from 'src/customer/customer.service';
import { Seller } from 'src/seller/entities/seller.entity';
import { SellerService } from 'src/seller/seller.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Admin, Customer, Seller]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: JwtSecretKeyTMP,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [
    UserService,
    AppService,
    AdminService,
    SellerService,
    CustomerService,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
