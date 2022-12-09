import { JwtCredentialPayload } from 'did-jwt-vc';
import { ServiceVerificationClaim, VerifyServiceVCArgs } from '../../types';
import { createVCTemplate } from './vc-tempale';

export const createServiceVerificationCredentialPayload = ({
  id,
  sub,
  iss,
  nbf,
  type,
  contractAddress,
  ...res
}: VerifyServiceVCArgs): JwtCredentialPayload =>
  createVCTemplate<ServiceVerificationClaim>({
    id,
    sub,
    iss,
    nbf,
    vcTypes: ['RifServiceVerification'],
    credentialSubject: {
      serviceVerified: {
        type,
        contractAddress,
      },
      ...res,
    },
  });
