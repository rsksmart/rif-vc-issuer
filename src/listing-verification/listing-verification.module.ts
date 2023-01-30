import { HttpModule } from '@nestjs/axios';
import { CacheModule, Module } from '@nestjs/common';
import { ListingVerificationController } from './controller/listing-verification.controller';
import { ListingVerificationService } from './service/listing-verification.service';
import { RifGatewayContract } from '../rif-gateway-contract/rif-gateway-contract.service';
import { ConfigModule } from '@nestjs/config';
import RifGatewayConfig from '../rif-gateway-contract/config';

@Module({
  controllers: [ListingVerificationController],
  providers: [ListingVerificationService, RifGatewayContract],
  imports: [
    ConfigModule.forRoot({
      load: [RifGatewayConfig]
    }),
    CacheModule.register(),
    HttpModule
  ],
})
export class ListingVerificationModule {}
