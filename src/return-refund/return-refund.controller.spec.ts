import { Test, TestingModule } from '@nestjs/testing';
import { ReturnRefundController } from './return-refund.controller';
import { ReturnRefundService } from './return-refund.service';

describe('ReturnRefundController', () => {
  let controller: ReturnRefundController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReturnRefundController],
      providers: [ReturnRefundService],
    }).compile();

    controller = module.get<ReturnRefundController>(ReturnRefundController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
