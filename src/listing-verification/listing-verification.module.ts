import { HttpModule } from '@nestjs/axios';
import { CacheModule, Module } from '@nestjs/common';
import { ListingVerificationController } from './controller/listing-verification.controller';
import { ListingVerificationService } from './service/listing-verification.service';

@Module({
  controllers: [ListingVerificationController],
  providers: [ListingVerificationService],
  imports: [CacheModule.register(), HttpModule],
})
export class ListingVerificationModule {}
