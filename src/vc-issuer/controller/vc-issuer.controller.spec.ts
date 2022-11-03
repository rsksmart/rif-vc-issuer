import { Test, TestingModule } from '@nestjs/testing';
import { VcIssuerController } from './vc-issuer.controller';

describe('VcIssuerController', () => {
  let controller: VcIssuerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VcIssuerController],
    }).compile();

    controller = module.get<VcIssuerController>(VcIssuerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
