import { CacheModule, Module } from '@nestjs/common';

import { VcIssuerModule } from './vc-issuer/vc-issuer.module';
import { ListingVerificationModule } from './listing-verification/listing-verification.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register(),
    VcIssuerModule,
    ListingVerificationModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
