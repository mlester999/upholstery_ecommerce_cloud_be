import { PartialType } from '@nestjs/mapped-types';
import { CreateSellerNotificationDto } from './create-seller-notification.dto';

export class UpdateSellerNotificationDto extends PartialType(CreateSellerNotificationDto) {}
