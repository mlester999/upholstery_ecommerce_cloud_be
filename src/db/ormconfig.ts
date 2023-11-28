import { ActivityLog } from 'src/activity-log/entities/activity-log.entity';
import { Admin } from 'src/admin/entities/admin.entity';
import { BankAccount } from 'src/bank-accounts/entities/bank-account.entity';
import { Category } from 'src/category/entities/category.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Follow } from 'src/follow/entities/follow.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { ReturnRefund } from 'src/return-refund/entities/return-refund.entity';
import { Review } from 'src/review/entities/review.entity';
import { SellerBalance } from 'src/seller-balance/entities/seller-balance.entity';
import { SellerNotification } from 'src/seller-notification/entities/seller-notification.entity';
import { SellerWithdrawal } from 'src/seller-withdrawal/entities/seller-withdrawal.entity';
import { Seller } from 'src/seller/entities/seller.entity';
import { Shop } from 'src/shop/entities/shop.entity';
import { User } from 'src/user/entities/user.entity';
import { Voucher } from 'src/voucher/entities/voucher.entity';
import { DataSourceOptions, DataSource } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: {
        rejectUnauthorized: false,
    },
    migrationsTransactionMode: 'each',
    entities: [
        User,
        Admin,
        Customer,
        Seller,
        Category,
        Product,
        Order,
        Voucher,
        Shop,
        ReturnRefund,
        BankAccount,
        SellerBalance,
        SellerWithdrawal,
        Review,
        Follow,
        Notification,
        SellerNotification,
        ActivityLog
      ],
    synchronize: true,
    logging: true,
    migrations: ["dist/src/migrations/*{.ts,.js}"],
    migrationsTableName: "migrations_typeorm",
    migrationsRun: true,
  };

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
