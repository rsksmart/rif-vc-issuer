import { Test, TestingModule } from '@nestjs/testing';
import { RifGatewayContractService } from './rif-gateway-contract.service';

describe('RifGatewayContractService', () => {
  let service: RifGatewayContractService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RifGatewayContractService],
    }).compile();

    service = module.get<RifGatewayContractService>(RifGatewayContractService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
