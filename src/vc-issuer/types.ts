import {
  JwtCredentialPayload,
  JwtCredentialSubject,
} from 'did-jwt-vc/lib/types';

export type BaseVC<T extends JwtCredentialSubject> = {
  id?: string;
  sub: string;
  iss: string;
  nbf: number;
  vcTypes: string[];
  credentialSubject: T;
};


export type CredentialType = 'EmailVerification' | 'RIFGatewayProviderVerification';

export type VcRequest = {
  did: string;
  credentialType: CredentialType;
  credentialPayload: JwtCredentialSubject;
  vcIssuanceChallenge: string;
  signature: string;
};

/**
 * Proof type for internal use, NOT a registered W3C vc-data-model proof type
 */
export type JWTProof = 'JwtProof2020';

export type Proof = {
  type: JWTProof;
  challenge: string;
  jws: string;
};

export type CredentialArgs = Pick<
  JwtCredentialPayload,
  'iss' | 'sub' | 'nbf'
> & JwtCredentialSubject & {
  proof: Proof;
};


export type VerifyCredentialRequest = {
  jwt: string;
}