import {
  JwtCredentialPayload,
  JwtCredentialSubject,
} from 'did-jwt-vc/lib/types';
import { ServiceType } from '../constants';

export type BaseVC<T extends JwtCredentialSubject> = {
  id?: string;
  sub: string;
  iss: string;
  nbf: number;
  vcTypes: string[];
  credentialSubject: T;
};

export type ServiceClaims = {
  type: ServiceType;
  contractAddress: string;
};

export type ServiceVerificationClaim = Record<'serviceVerified', ServiceClaims>;

export type VcRequest = {
  did: string;
  credentialPayload: ServiceClaims;
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

export type VerifyServiceVCArgs = Pick<
  JwtCredentialPayload,
  'iss' | 'sub' | 'nbf'
> & {
  proof: Proof;
  [prop: string]: any;
};
