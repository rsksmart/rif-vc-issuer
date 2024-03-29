import { CacheModule, Module } from '@nestjs/common';

import { VcIssuerModule } from './vc-issuer/vc-issuer.module';
import { ListingVerificationModule } from './listing-verification/listing-verification.module';
import { ConfigModule } from '@nestjs/config';
import issuerConfig from './vc-issuer/config/issuer';
import emailConfig from './listing-verification/config/emailAccount';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [issuerConfig, emailConfig],
      isGlobal: true
    }),
    CacheModule.register(),
    VcIssuerModule,
    ListingVerificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
