import { Module } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherController } from './voucher.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voucher } from './entities/voucher.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtSecretKeyTMP, JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Voucher]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: JwtSecretKeyTMP,
      signOptions: { expiresIn: '3h' },
    }),
  ],
  controllers: [VoucherController],
  providers: [VoucherService, JwtStrategy],
})
export class VoucherModule {}
