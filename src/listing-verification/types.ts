import { ServiceVerificationStatus } from './constants';

export interface ServiceRegistrationRequest {
  did: string;
  contractAddress: string;
}

export interface RegistrationData extends ServiceRegistrationRequest {
  verificationChallenge: string;
  verificationExpirationDate: string;
  status: ServiceVerificationStatus;
  vcIssuanceChallenge?: string;
  registrationId: string;
}

export interface VerificationRequest {
  registrationId: string;
  signature: string;
}

export type ServiceType = 'Lending' | 'Borrowing';

export interface VCRequest extends ServiceRegistrationRequest {
  type: ServiceType;
  registrationId: string;
}

export type ServiceVerificationCredentialPayload = {
  serviceVerified: {
    contractAddress: string;
    type: ServiceType;
  };
};
