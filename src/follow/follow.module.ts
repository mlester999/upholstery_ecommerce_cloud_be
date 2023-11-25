import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtSecretKeyTMP, JwtStrategy } from 'src/auth/jwt.strategy';
import { Follow } from './entities/follow.entity';
import { Shop } from 'src/shop/entities/shop.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { ShopService } from 'src/shop/shop.service';
import { CustomerService } from 'src/customer/customer.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Follow, Shop, Customer]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: JwtSecretKeyTMP,
      signOptions: { expiresIn: '3h' },
    }),
  ],
  controllers: [FollowController],
  providers: [FollowService, ShopService, CustomerService, JwtStrategy],
})
export class FollowModule {}
