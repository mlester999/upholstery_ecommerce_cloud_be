import { Module } from '@nestjs/common';
import { BankAccountsService } from './bank-accounts.service';
import { BankAccountsController } from './bank-accounts.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtSecretKeyTMP, JwtStrategy } from 'src/auth/jwt.strategy';
import { BankAccount } from './entities/bank-account.entity';
import { Seller } from 'src/seller/entities/seller.entity';
import { ActivityLog } from 'src/activity-log/entities/activity-log.entity';
import { SellerService } from 'src/seller/seller.service';
import { ActivityLogService } from 'src/activity-log/activity-log.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([BankAccount, Seller, ActivityLog]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: JwtSecretKeyTMP,
      signOptions: { expiresIn: '3h' },
    }),
  ],
  controllers: [BankAccountsController],
  providers: [BankAccountsService, SellerService, ActivityLogService, JwtStrategy],
})
export class BankAccountsModule {}
