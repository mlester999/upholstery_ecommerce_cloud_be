import { Test, TestingModule } from '@nestjs/testing';
import { SellerWithdrawalService } from './seller-withdrawal.service';

describe('SellerWithdrawalService', () => {
  let service: SellerWithdrawalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SellerWithdrawalService],
    }).compile();

    service = module.get<SellerWithdrawalService>(SellerWithdrawalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
