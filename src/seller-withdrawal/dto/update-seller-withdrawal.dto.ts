import { PartialType } from '@nestjs/mapped-types';
import { CreateSellerWithdrawalDto } from './create-seller-withdrawal.dto';

export class UpdateSellerWithdrawalDto extends PartialType(CreateSellerWithdrawalDto) {}
