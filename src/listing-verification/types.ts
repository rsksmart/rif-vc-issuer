
export interface ServiceRegistrationRequest {
    did: string;
    contractAddress: string;
}

export interface RegistrationData extends ServiceRegistrationRequest {
    verificationChallenge: string;
    verificationExpirationDate: string;
    verified: boolean;
    vcIssuanceChallenge?: string;
    registrationId: string;
}

export interface VerificationRequest {
    registrationId: string;
    signature: string;
}

export type ServiceType = 'Lending' | 'Borrowing';

export type ServiceVerificationCredentialPayload = {
    serviceVerified:  {
        contractAddress: string,
        type: ServiceType
    }   
}
