import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { User } from 'src/user/entities/user.entity';
import { JwtSecretKeyTMP, JwtStrategy } from 'src/auth/jwt.strategy';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ActivityLogService } from 'src/activity-log/activity-log.service';
import { ActivityLog } from 'src/activity-log/entities/activity-log.entity';
import { ReturnRefundModule } from 'src/return-refund/return-refund.module';
import { ReviewModule } from 'src/review/review.module';

@Module({
  imports: [
    AuthModule,
    ReturnRefundModule,
    ReviewModule,
    TypeOrmModule.forFeature([Customer, User, ActivityLog]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: JwtSecretKeyTMP,
      signOptions: { expiresIn: '3h' },
    }),
  ],
  controllers: [CustomerController],
  providers: [CustomerService, UserService, ActivityLogService, JwtStrategy],
})
export class CustomerModule {}
