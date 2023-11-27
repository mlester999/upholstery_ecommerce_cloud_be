import { Test, TestingModule } from '@nestjs/testing';
import { SellerNotificationService } from './seller-notification.service';

describe('SellerNotificationService', () => {
  let service: SellerNotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SellerNotificationService],
    }).compile();

    service = module.get<SellerNotificationService>(SellerNotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
