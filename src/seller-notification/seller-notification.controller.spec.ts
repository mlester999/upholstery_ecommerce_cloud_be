import { Test, TestingModule } from '@nestjs/testing';
import { SellerNotificationController } from './seller-notification.controller';
import { SellerNotificationService } from './seller-notification.service';

describe('SellerNotificationController', () => {
  let controller: SellerNotificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellerNotificationController],
      providers: [SellerNotificationService],
    }).compile();

    controller = module.get<SellerNotificationController>(SellerNotificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
