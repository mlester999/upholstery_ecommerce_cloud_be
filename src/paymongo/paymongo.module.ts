import { Module } from '@nestjs/common';
import { PaymongoController } from './paymongo.controller';

@Module({
  controllers: [PaymongoController],
  providers: [],
})
export class PaymongoModule {}
