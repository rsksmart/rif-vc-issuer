import { Test, TestingModule } from '@nestjs/testing';
import { ListingVerificationService } from './listing-verification.service';

describe('ListingVerificationService', () => {
  let service: ListingVerificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListingVerificationService],
    }).compile();

    service = module.get<ListingVerificationService>(
      ListingVerificationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
