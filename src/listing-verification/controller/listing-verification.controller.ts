import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseFilters,
} from '@nestjs/common';
import { ListingVerificationService } from '../service/listing-verification.service';
import { AcknowledgeVerification, ServiceRegistrationRequest, VerificationRequest } from '../types';
import {
  NotAuthorizedExceptionFilter,
  RecordAlreadyExistsExceptionFilter,
  RecordNotFoundExceptionFilter,
  VerificationExceptionFilter,
} from './exception-filters';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ListingVerificationDocSchema } from '../../doc-schemas';

@ApiTags(ListingVerificationDocSchema.name)
@Controller('listing')
export class ListingVerificationController {
  constructor(private listingVerificationService: ListingVerificationService) {}

  @ApiOperation({ summary: 'readiness & liveness probe'})
  @Get(['', 'ping'])
  ping(): string {
    return 'pong';
  }

  @ApiOperation(ListingVerificationDocSchema.getVerificationById.operation)
  @ApiParam(ListingVerificationDocSchema.getVerificationById.parameters)
  @Get('verification/:registrationId')
  @UseFilters(RecordNotFoundExceptionFilter, VerificationExceptionFilter)
  getRegistration(@Param('registrationId') registrationId: string) {
    return this.listingVerificationService.getRegistration(registrationId);
  }

  @ApiOperation(ListingVerificationDocSchema.requestVerification.operation)
  @ApiBody(ListingVerificationDocSchema.requestVerification.body)
  @ApiResponse(ListingVerificationDocSchema.requestVerification.response)
  @Post('requestVerification')
  @UseFilters(RecordAlreadyExistsExceptionFilter)
  requestVerification(@Body() registrationRequest: ServiceRegistrationRequest) {
    return this.listingVerificationService.requestVerification(registrationRequest);
  }

  @ApiOperation(ListingVerificationDocSchema.verify.operation)
  @ApiBody(ListingVerificationDocSchema.verify.body)
  @Post('verify')
  @UseFilters(RecordNotFoundExceptionFilter, NotAuthorizedExceptionFilter)
  verify(@Body() verificationRequest: VerificationRequest) {
    return this.listingVerificationService.verify(
      verificationRequest,
    );
  }

  @ApiOperation(ListingVerificationDocSchema.acknowledgeVerification.operation)
  @ApiBody(ListingVerificationDocSchema.acknowledgeVerification.body)
  @ApiResponse(ListingVerificationDocSchema.acknowledgeVerification.response)
  @Post('acknowledgeVerification')
  @UseFilters(RecordNotFoundExceptionFilter, NotAuthorizedExceptionFilter)
  acknowledgeVerification(@Body() acknowledgeVerification: AcknowledgeVerification) {
    return this.listingVerificationService.acknowledgeVerification(
      acknowledgeVerification,
    );
  }
}
