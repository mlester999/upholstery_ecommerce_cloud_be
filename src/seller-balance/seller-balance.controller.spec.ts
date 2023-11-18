import { Test, TestingModule } from '@nestjs/testing';
import { SellerBalanceController } from './seller-balance.controller';
import { SellerBalanceService } from './seller-balance.service';

describe('SellerBalanceController', () => {
  let controller: SellerBalanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellerBalanceController],
      providers: [SellerBalanceService],
    }).compile();

    controller = module.get<SellerBalanceController>(SellerBalanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
