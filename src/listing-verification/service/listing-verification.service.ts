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
  VerificationError,
} from '../errors';
import {
  RegistrationData,
  ServiceRegistrationRequest,
  ServiceVerificationCredentialPayload,
  VCRequest,
  VerificationRequest,
} from '../types';
import { map, Observable } from 'rxjs';
import { serviceVerificationStatus } from '../constants';

@Injectable()
export class ListingVerificationService {

  private readonly logger = new Logger(ListingVerificationService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
    private http: HttpService,
  ) {}

  async getRegistration(registrationId: string): Promise<RegistrationData> {
    return this.getRecordIfExists(registrationId);
  }

  async registration({
    did,
    contractAddress,
  }: ServiceRegistrationRequest): Promise<RegistrationData> {
    const verificationChallenge = this.getChallenge();
    const registrationId = this.generateRegistrationId(did, contractAddress);
    
    this.logger.debug("registration ~ verificationChallenge", verificationChallenge)

    const registration = await this.cacheManager.get<RegistrationData>(
      registrationId,
    );
    if (registration) {
      throw new RecordAlreadyExistsError('service registration already exists');
    }

    const verificationExpirationDate = (Date.now() + TTL_CACHE).toString();
    const registrationData: RegistrationData = {
      did,
      registrationId,
      verificationChallenge,
      contractAddress,
      verificationExpirationDate,
      status: 'registered',
    };

    await this.cacheManager.set<RegistrationData>(
      registrationId,
      registrationData,
      { ttl: TTL_CACHE },
    );

    

    return registrationData;
  }

  // TODO: defined what other properties we need to validate the service
  async requestVerification({
    registrationId,
    signature,
  }: VerificationRequest) {
    const registrationData = await this.getRecordIfExists(registrationId);
    const { verificationChallenge, did, contractAddress, status } =
      registrationData;

    if (!serviceVerificationStatus[status]) {
      throw new VerificationError('service already verified');
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

    // We request right away the VC since we don't have
    // the verification process ready, eventually this
    // will be triggered by the entity who reviews the contract
    return this.requestVC({
      registrationId,
      contractAddress,
      did,
      type: 'Lending',
    }); // TODO: this will be inferred with ERC-165
  }

  private async requestVC({
    registrationId,
    contractAddress,
    did,
    type,
  }: VCRequest) {
    const credentialPayload: ServiceVerificationCredentialPayload = {
      serviceVerified: {
        type,
        contractAddress,
      },
    };

    const vcIssuanceChallenge = this.getChallenge();
    const hashMsg = ethers.utils.id(vcIssuanceChallenge);
    const signature = await signMessage(
      process.env.RIF_OWNER_PRIV_KEY,
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
      { registrationId, contractAddress, did, type },
    );

    return this.http
      .post<Observable<any>>(`${BASE_URL}/vc-issuer`, {
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
      throw new RecordNotFoundError('service registration not found');
    }

    return registrationData;
  }

  private generateRegistrationId(did: string, contractAddress: string): string {
    return ethers.utils.id(`${did}-${contractAddress}`);
  }

  private getChallenge(): string {
    return `0x${getRandomBytesHex(32)}`;
  }
}
