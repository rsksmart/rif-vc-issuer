import { JwtCredentialSubject } from 'did-jwt-vc/lib/types';
import { ServiceVerificationStatus } from './constants';

export interface ServiceRegistrationRequest {
  did?: string;
  email: string;
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
  accepted: boolean;
}

export interface AcknowledgeVerification extends Pick<VerificationRequest, 'registrationId'> {
  signature: string;
}

export type ServiceType = 'Lending' | 'Borrowing';

export interface VCRequest<T extends JwtCredentialSubject> extends Pick<ServiceRegistrationRequest, 'did'> {
  registrationId: string;
  credentialType: string;
  credentialPayload: T;
}

export type ProviderVerificationCredentialPayload = {
  email: string;
};

export type ServiceVerificationCredentialPayload = {
  serviceVerified: {
    contractAddress: string;
    type: ServiceType;
  };
};
