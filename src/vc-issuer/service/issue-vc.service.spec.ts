import { Test, TestingModule } from '@nestjs/testing';
import { IssueVcService } from './issue-vc.service';

describe('IssueVcService', () => {
  let service: IssueVcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IssueVcService],
    }).compile();

    service = module.get<IssueVcService>(IssueVcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
