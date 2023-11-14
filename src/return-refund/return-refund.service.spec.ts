import { Test, TestingModule } from '@nestjs/testing';
import { ReturnRefundService } from './return-refund.service';

describe('ReturnRefundService', () => {
  let service: ReturnRefundService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReturnRefundService],
    }).compile();

    service = module.get<ReturnRefundService>(ReturnRefundService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
