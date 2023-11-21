import { PartialType } from '@nestjs/mapped-types';
import { CreateReturnRefundDto } from './create-return-refund.dto';

export class UpdateReturnRefundDto extends PartialType(CreateReturnRefundDto) {}
