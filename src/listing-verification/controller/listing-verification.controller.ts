import { Body, Controller, Get, Inject, Param, Post, UseFilters } from '@nestjs/common';
import { ListingVerificationService } from '../service/listing-verification.service';
import { ServiceRegistrationRequest, VerificationRequest } from '../types';
import { NotAuthorizedExceptionFilter, RecordAlreadyExistsExceptionFilter, RecordNotFoundExceptionFilter, VerificationExceptionFilter } from './exception-filters';

@Controller('listing')
export class ListingVerificationController {

    constructor(private listingVerificationService: ListingVerificationService) {}
    
    @Get(['','ping'])
    ping(): string {
      return 'pong';
    }

    @Get('registration/:id')
    @UseFilters(RecordNotFoundExceptionFilter, VerificationExceptionFilter)
    getRegistration(@Param('id') registrationId : string) {
        return this.listingVerificationService.getRegistration(registrationId);
    }

    @Post('registration')
    @UseFilters(RecordAlreadyExistsExceptionFilter)
    registration(@Body() registrationRequest: ServiceRegistrationRequest) {
        return this.listingVerificationService.registration(registrationRequest);
    }

    @Post('requestVerification')
    @UseFilters(RecordNotFoundExceptionFilter, NotAuthorizedExceptionFilter)
    requestVerification(@Body() verificationRequest: VerificationRequest): any {
        return this.listingVerificationService.createVerificationRequest(verificationRequest);
    }

}
