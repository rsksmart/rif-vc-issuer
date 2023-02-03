import { Injectable, Logger } from '@nestjs/common';
import { createVerifiableCredentialJwt, Issuer } from 'did-jwt-vc';
import didJWT from 'did-jwt';
import { createIssuerIdentity } from '../../utils/crypto';
import { VcRequest } from '../types';
import { createServiceVerificationCredentialPayload } from '../vcs/rif-gateway/service-validated';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IssueVcService {
  private readonly logger = new Logger(IssueVcService.name);

  private issuers: Map<string, Issuer>;

  constructor(private configService: ConfigService) {
    this.logger.debug('ISSUER_PRIV_KEY: ' + this.configService.get<string>('issuer.privateKey'));

    this.issuers = new Map();

     // The following works with RSK checksum address only
    const issuer = createIssuerIdentity(this.configService.get<string>('issuer.privateKey')) as Issuer;
    
    // The following works Ethereum checksum address
    // const issuer = new EthrDID({
    //     identifier: process.env.ISSUER_ADDR,
    //     privateKey: process.env.ISSUER_PRIV_KEY,
    //     alg: 'ES256K',
    //     signer: (data: string) => signMessage(process.env.ISSUER_PRIV_KEY, data)
    // }) as Issuer;
    this.issuers.set(this.configService.get<string>('issuer.address'), issuer);
  }

  async issueVc({
    credentialPayload,
    vcIssuanceChallenge,
    did: sub,
    signature,
  }: VcRequest) {
    const payload = createServiceVerificationCredentialPayload({
      ...credentialPayload,
      iss: this.configService.get<string>('issuer.address'),
      sub,
      nbf: new Date().getSeconds(),
      id: '', // TODO: credential id,
      proof: {
        type: 'JwtProof2020',
        challenge: vcIssuanceChallenge,
        jws: signature,
      },
    });

    this.logger.debug(
      '🚀 ~ file: issue-vc.service.ts ~ line 39 ~ IssueVcService ~ issueVc ~ payload',
      payload,
    );

    const jwt = await createVerifiableCredentialJwt(
      payload,
      this.issuers.get(this.configService.get<string>('issuer.address')),
    );

    this.logger.debug(
      '🚀 ~ file: issue-vc.service.ts ~ line 45 ~ IssueVcService ~ issueVc ~ jws',
      jwt,
    );

    this.logger.debug(didJWT.decodeJWT(jwt));

    return { jwt };
  }
}
