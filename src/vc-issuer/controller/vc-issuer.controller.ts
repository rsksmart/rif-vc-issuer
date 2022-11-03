import { Body, Controller, Get, Post } from '@nestjs/common';
import { IssueVcService } from '../service/issue-vc.service';
import { VcRequest } from '../types';

@Controller('vc-issuer')
export class VcIssuerController {

    constructor(private vcIssuerService: IssueVcService) {}

    @Get('ping')
    ping(): string {
      return 'pong';
    }

    @Post()
    requestVC(@Body() req: VcRequest) {
      return this.vcIssuerService.issueVc(req);
    }
  
}
