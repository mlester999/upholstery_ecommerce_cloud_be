import { Module } from '@nestjs/common';
import { ReturnRefundService } from './return-refund.service';
import { ReturnRefundController } from './return-refund.controller';
import { JwtSecretKeyTMP, JwtStrategy } from 'src/auth/jwt.strategy';
import { ReturnRefund } from './entities/return-refund.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ActivityLogService } from 'src/activity-log/activity-log.service';
import { DoSpacesService } from 'src/spaces-module/spaces-service/doSpacesService';
import { DoSpacesServiceProvider } from 'src/spaces-module/spaces-service';
import { ActivityLog } from 'src/activity-log/entities/activity-log.entity';
import { Order } from 'src/order/entities/order.entity';
import { OrderService } from 'src/order/order.service';
import { Product } from 'src/product/entities/product.entity';
import { ProductService } from 'src/product/product.service';
import { Customer } from 'src/customer/entities/customer.entity';
import { CustomerService } from 'src/customer/customer.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([ReturnRefund, ActivityLog, Order, Product, Customer]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: JwtSecretKeyTMP,
      signOptions: { expiresIn: '3h' },
    }),
  ],
  controllers: [ReturnRefundController],
  providers: [ReturnRefundService, 
    DoSpacesServiceProvider,
    DoSpacesService,
    OrderService,
    ProductService,
    CustomerService,
    ActivityLogService, 
    JwtStrategy],
})
export class ReturnRefundModule {}
