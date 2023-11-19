import { Test, TestingModule } from '@nestjs/testing';
import { SellerWithdrawalController } from './seller-withdrawal.controller';
import { SellerWithdrawalService } from './seller-withdrawal.service';

describe('SellerWithdrawalController', () => {
  let controller: SellerWithdrawalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellerWithdrawalController],
      providers: [SellerWithdrawalService],
    }).compile();

    controller = module.get<SellerWithdrawalController>(SellerWithdrawalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
