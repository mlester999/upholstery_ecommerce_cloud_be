import { Test, TestingModule } from '@nestjs/testing';
import { SellerBalanceService } from './seller-balance.service';

describe('SellerBalanceService', () => {
  let service: SellerBalanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SellerBalanceService],
    }).compile();

    service = module.get<SellerBalanceService>(SellerBalanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
