import { Injectable, Logger } from '@nestjs/common';
import { createVerifiableCredentialJwt, Issuer, JwtCredentialPayload, verifyCredential } from 'did-jwt-vc';
import { createIssuerIdentity } from '../../utils/crypto';
import { CredentialArgs, CredentialType, VcRequest } from '../types';
import { ConfigService } from '@nestjs/config';
import { createEmailCredentialPayload } from '../vcs/rif-gateway/email';
import { createProviderCredentialPayload } from '../vcs/rif-gateway/provider';
import { Resolver } from 'did-resolver'
import { getResolver } from 'ethr-did-resolver'
import { toChecksumAddress } from 'rskjs-util'

@Injectable()
export class IssueVcService {
  private readonly logger = new Logger(IssueVcService.name);

  private issuers: Map<string, Issuer>;

  private didResolver: Resolver;

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

    // TODO: move this to a separate class
    const providerConfig = {
      name: "rsk", 
      chainId: '0x7a69',
      rpcUrl: 'http://127.0.0.1:8545/', 
      registry: '0x5fbdb2315678afecb367f032d93f642f64180aa3'
    };
    const etherDidResolver = getResolver(providerConfig);
    this.didResolver = new Resolver(etherDidResolver);
  }

  async issueVc(vcRequest: VcRequest) {
    return this.createJWTCredential(vcRequest);
  }

  private async createJWTCredential(vcRequest: VcRequest) {
    const { credentialType } = vcRequest;
    const credentialPayload = await this.getCredentialPayload(credentialType, vcRequest);

    const jwt = await createVerifiableCredentialJwt(
      credentialPayload,
      this.issuers.get(this.configService.get<string>('issuer.address')),
    );

    return jwt;
  }

  private async getCredentialPayload(credentialType: CredentialType, {
    credentialPayload,
    vcIssuanceChallenge,
    did: sub,
    signature,
  }: VcRequest) {

    const credentialData: CredentialArgs = {
      ...credentialPayload,
      iss: this.configService.get<string>('issuer.address').toLowerCase(),
      sub: sub.toLowerCase(),
      nbf: new Date().getSeconds(),
      proof: {
        type: 'JwtProof2020',
        challenge: vcIssuanceChallenge,
        jws: signature,
      },
    };

    let vcPayload: JwtCredentialPayload;
    if (String(credentialType) === 'EmailVerification') {
      vcPayload = createEmailCredentialPayload(credentialData);
    } else if (String(credentialType) === 'RIFGatewayProviderVerification') {
      vcPayload = createProviderCredentialPayload(credentialData);
    } else { 
      throw new Error('Invalid credential type');
    }

    return vcPayload;
  }

  public async verifyCredentialJWT(vc: string) {
    return verifyCredential(vc, this.didResolver);
  }
}