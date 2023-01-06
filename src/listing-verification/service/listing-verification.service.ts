import { CacheStore, CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ethers } from 'ethers';
import { BASE_URL, TTL_CACHE } from '../../constants';
import {
  getAccountFromDID,
  getRandomBytesHex,
  recoverSigner,
  signMessage,
} from '../../utils/crypto';
import {
  NotAuthorizedError,
  RecordAlreadyExistsError,
  RecordNotFoundError,
} from '../errors';
import {
  AcknowledgeVerification,
  RegistrationData,
  ServiceRegistrationRequest,
  VCRequest,
  VerificationRequest,
} from '../types';
import { firstValueFrom, forkJoin, map, Observable, switchMap, zip } from 'rxjs';
import { VerificationSenderFactory } from '../email-service/verificationSenderFactory';
import { ConfigService } from '@nestjs/config';
import { EmailAddressClaim } from '../../vc-issuer/vcs/rif-gateway/email';
import { ServiceProviderClaim } from '../../vc-issuer/vcs/rif-gateway/provider';
import { IRifGateway, RifGatewayContract } from '../../rif-gateway-contract/rif-gateway-contract.service';


@Injectable()
export class ListingVerificationService {

  private readonly logger = new Logger(ListingVerificationService.name);
  private rifGatewayContract: IRifGateway;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
    private configService: ConfigService,
    private http: HttpService,
    private rifGateway: RifGatewayContract,
  ) {
    this.rifGatewayContract = this.rifGateway.getInstance() as unknown as IRifGateway;
  }

  async getRegistration(registrationId: string): Promise<RegistrationData> {
    return this.getRecordIfExists(registrationId);
  }

  async requestVerification({
    did,
    email
  }: ServiceRegistrationRequest): Promise<RegistrationData> {
    const registrationId = this.generateRegistrationId(did, email);

    const registration = await this.cacheManager.get<RegistrationData>(
      registrationId,
    );

    if (registration) {
      throw new RecordAlreadyExistsError('service registration already exists');
    }

    const verificationExpirationDate = (Date.now() + TTL_CACHE).toString();
    const registrationData: RegistrationData = {
      did: did.toLowerCase(),
      registrationId,
      verificationChallenge: null,
      verificationExpirationDate,
      email,
      status: 'created',
  };

    await this.cacheManager.set<RegistrationData>(
      registrationId,
      registrationData,
      { ttl: TTL_CACHE },
    );

    return registrationData;
  }


  async verify({
    registrationId,
    accepted
  }: VerificationRequest) {
    const registrationData = await this.getRecordIfExists(registrationId);
    const { email: to, status, did } =
      registrationData;

    if (status !== 'created') {
      throw new Error('Invalid registration state');
    }

    const verificationChallenge = this.getChallenge();
    const updatedRegistration: RegistrationData = {
      ...registrationData,
      verificationChallenge,
      status: accepted ? 'pendingConfirmation' : 'rejected',
    };

    await this.cacheManager.set<RegistrationData>(
      registrationId,
      updatedRegistration,
      { ttl: TTL_CACHE }
    );

    const providerAddress = getAccountFromDID(did).toLowerCase();
    await this.rifGatewayContract.validateProvider(providerAddress);

    this.logger.debug(updatedRegistration);

    // TODO: trigger the verification process (TBD)
    const emailVerificationService = await VerificationSenderFactory.getEmailVerificationService({
      host: this.configService.get<string>('email.host'),
      port: this.configService.get<number>('email.port'),
      auth: {
        user: this.configService.get<string>('email.user'),
        pass: this.configService.get<string>('email.password'),
      },
    });

    const emailResponse = await emailVerificationService.send(to, `
      Email ${to} successfully verified, please sign this challenge to continue with the process:

       > did: ${did}

       > Challenge: ${verificationChallenge}

       > Resource: '/listing/acknowledgeVerification'
  `);

    this.logger.debug('email response:', emailResponse);
    this.logger.debug('email delivery state:', await emailVerificationService.logResponse(emailResponse));
  }

  async acknowledgeVerification({ registrationId, signature }: AcknowledgeVerification) {
    this.logger.debug(registrationId);
    const registrationData = await this.getRecordIfExists(registrationId);
    const { did, status, verificationChallenge, email: emailAddress } = registrationData;

    this.logger.debug(emailAddress);

    if (status !== 'pendingConfirmation') {
      throw new Error('Invalid registration state');
    }

    const expectedSigner = getAccountFromDID(did).toLowerCase();
    const signer = recoverSigner(
      verificationChallenge,
      signature,
    ).toLowerCase();

    if (signer !== expectedSigner) {
      throw new NotAuthorizedError('challenge signer does not match author');
    }

    const updatedRegistration: RegistrationData = {
      ...registrationData,
      status: 'verified',
    };

    await this.cacheManager.set<RegistrationData>(
      registrationId,
      updatedRegistration,
      { ttl: 0 },
    );

    const [vcEmailObservable, vcProviderObservable] = await Promise.all([
      this.requestVC<EmailAddressClaim>({
        registrationId,
        did,
        credentialType: 'EmailVerification',
        credentialPayload: { emailAddress },
      }),
      this.requestVC<ServiceProviderClaim>({
        registrationId,
        did,
        credentialType: 'RIFGatewayProviderVerification',
        credentialPayload: { 
          verification: {
            type: 'ServiceProvider',
            name: 'Validation of Service Provider'
          }
         }
      })
    ]);

    const [vcEmail, vcProvider] = await firstValueFrom(
      forkJoin([
        vcEmailObservable.pipe(map(resp => resp)),
        vcProviderObservable.pipe(map(resp => resp)),
      ])
    );

    return {
      vcEmail,
      vcProvider
    }
  }

  private async requestVC<T>({
    registrationId,
    did,
    credentialType,
    credentialPayload
  }: VCRequest<T>) {

    const vcIssuanceChallenge = this.getChallenge();
    const hashMsg = ethers.utils.id(vcIssuanceChallenge);
    const signature = await signMessage(
      this.configService.get<string>('issuer.privateKey'),
      hashMsg,
    );

    const registration = await this.getRecordIfExists(registrationId);
    await this.cacheManager.set<RegistrationData>(
      registrationId,
      { ...registration, vcIssuanceChallenge },
      { ttl: 0 },
    );

    this.logger.debug(
      'ListingVerificationService ~ requestVC ~ record',
      { registrationId, did },
    );

    return this.http
      .post<Observable<any>>(`${BASE_URL}/vc-issuer/requestVC`, {
        credentialType,
        credentialPayload,
        did,
        vcIssuanceChallenge,
        signature,
      })
      .pipe(map((response) => response.data));
  }

  private async getRecordIfExists(
    registrationId: string,
  ): Promise<RegistrationData> {
    const registrationData = await this.cacheManager.get<RegistrationData>(
      registrationId,
    );

    if (!registrationData) {
      throw new RecordNotFoundError('Service registration not found');
    }

    return registrationData;
  }

  private generateRegistrationId(did: string, email: string): string {
    return ethers.utils.id(`${did}-${email}`);
  }

  private getChallenge(): string {
    return `0x${getRandomBytesHex(32)}`;
  }
}
