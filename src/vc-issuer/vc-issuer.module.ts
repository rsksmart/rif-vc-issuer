import { Module } from '@nestjs/common';
import { VcIssuerController } from './controller/vc-issuer.controller';
import { IssueVcService } from './service/issue-vc.service';

@Module({
  controllers: [VcIssuerController],
  providers: [IssueVcService],
})
export class VcIssuerModule {}
