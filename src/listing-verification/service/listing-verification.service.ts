import { CacheStore, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ethers } from 'ethers';
import { BASE_URL, TTL_CACHE } from '../../constants';
import { getAccountFromDID, getRandomBytesHex, recoverSigner, signMessage } from '../../utils/crypto';
import { NotAuthorizedError, RecordAlreadyExistsError , RecordNotFoundError, VerificationError  } from '../errors';
import { RegistrationData, ServiceRegistrationRequest, ServiceVerificationCredentialPayload, VerificationRequest } from '../types';
import { map, Observable } from 'rxjs';


@Injectable()
export class ListingVerificationService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: CacheStore, private http: HttpService) {}

    async getRegistration(registrationId: string): Promise<RegistrationData> {
        return this.getRecordIfExists(registrationId);
    }

    async registration({ did, contractAddress }: ServiceRegistrationRequest): Promise<RegistrationData> {
        const verificationChallenge = this.getChallenge();
        const registrationId = this.generateRegistrationId(did, contractAddress);

        const registration = await this.cacheManager.get<RegistrationData>(registrationId);
        if (registration) {
            throw new RecordAlreadyExistsError('service registration already exists');
        }

        const verificationExpirationDate = (Date.now() + TTL_CACHE).toString();
        const registrationData = {
            did,
            registrationId,
            verificationChallenge,
            contractAddress,
            verificationExpirationDate,
            verified: false
        };

        await this.cacheManager.set<RegistrationData>(registrationId, registrationData, { ttl: TTL_CACHE });

        return registrationData;
    }

    // TODO: defined what other properties we need to validate the service
    async createVerificationRequest({ registrationId, signature }: VerificationRequest) {
        const registrationData = await this.getRecordIfExists(registrationId);
        const { verificationChallenge, did, verified } = registrationData;

        if (verified) {
            throw new VerificationError('service already verified');
        }

        const expectedSigner = getAccountFromDID(did).toLowerCase();
        const signer = recoverSigner(verificationChallenge, signature).toLowerCase();
        
        if (signer !== expectedSigner) {
            throw new NotAuthorizedError('challenge signer does not match author');
        }

        const updatedRegistration = { ...registrationData, verified: true };
        await this.cacheManager.set<RegistrationData>(registrationId, updatedRegistration, { ttl: 0 });

        // here we start the contract verification process
        return this.requestVC(updatedRegistration);
    }

    private async requestVC(record: RegistrationData) {
        const { registrationId, contractAddress, did } = record;
        const credentialPayload: ServiceVerificationCredentialPayload = {
            serviceVerified: {
                type: 'Lending', // TODO: this will be inferred with ERC-165
                contractAddress,
            }
        }

        const vcIssuanceChallenge = this.getChallenge();
        const hashMsg = ethers.utils.id(vcIssuanceChallenge);
        const signature = await signMessage(process.env.RIF_OWNER_PRIV_KEY, hashMsg);

        await this.cacheManager.set<RegistrationData>(registrationId, { ...record, vcIssuanceChallenge }, { ttl: 0 });

        console.log("🚀 ~ file: listing-verification.service.ts ~ line 67 ~ ListingVerificationService ~ requestVC ~ record", record)

        return this.http.post<Observable<any>>(`${BASE_URL}/vc-issuer`, { 
                credentialPayload, 
                did, 
                vcIssuanceChallenge,
                signature 
            }).pipe(
                map(response => response.data)
            );
    }

    private async getRecordIfExists(registrationId: string): Promise<RegistrationData> {
        const registrationData = await this.cacheManager.get<RegistrationData>(registrationId);

        if (!registrationData) {
            throw new RecordNotFoundError('service registration not found');
        }

        return registrationData;
    }

    private generateRegistrationId (did: string, contractAddress: string): string  {
        return ethers.utils.id(`${did}-${contractAddress}`);
    }

    private getChallenge(): string  {
        return `0x${getRandomBytesHex(32)}`;
    }
}
