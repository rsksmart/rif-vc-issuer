import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VCIssuerDocSchema } from '../../doc-schemas';
import { IssueVcService } from '../service/issue-vc.service';
import { VcRequest, VerifyCredentialRequest } from '../types';

@ApiTags(VCIssuerDocSchema.name)
@Controller('vc-issuer')
export class VcIssuerController {
  constructor(private vcIssuerService: IssueVcService) {}

  @ApiOperation({ summary: 'readiness & liveness probe'})
  @Get('ping')
  ping(): string {
    return 'pong';
  }

  @ApiOperation(VCIssuerDocSchema.requestVC.operation)
  @ApiBody(VCIssuerDocSchema.requestVC.body)
  @ApiResponse(VCIssuerDocSchema.requestVC.response)
  @Post('requestVC')
  requestVC(@Body() req: VcRequest) {
    return this.vcIssuerService.issueVc(req);
  }

  @ApiOperation(VCIssuerDocSchema.verifyCredential.operation)
  @ApiBody(VCIssuerDocSchema.verifyCredential.body)
  @ApiResponse(VCIssuerDocSchema.verifyCredential.response)
  @Post('verifyCredential')
  verifyCredential(@Body() req: VerifyCredentialRequest) {
    return this.vcIssuerService.verifyCredentialJWT(req.jwt);
  }
}
