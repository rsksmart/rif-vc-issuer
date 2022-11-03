import { Test, TestingModule } from '@nestjs/testing';
import { ListingVerificationController } from './listing-verification.controller';

describe('ListingVerificationController', () => {
  let controller: ListingVerificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListingVerificationController],
    }).compile();

    controller = module.get<ListingVerificationController>(ListingVerificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
