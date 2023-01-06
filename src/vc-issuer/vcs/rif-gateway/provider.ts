import { JwtCredentialPayload } from 'did-jwt-vc';
import { CredentialArgs } from '../../types';
import { createVCTemplate } from './vc-tempale';

export type ServiceProviderClaim = {
    verification: {
      type: 'ServiceProvider',
      name: 'Validation of Service Provider'
    }
  }

export const createProviderCredentialPayload = ({
  sub,
  iss,
  nbf,
  ...res
}: CredentialArgs): JwtCredentialPayload =>
  createVCTemplate<ServiceProviderClaim>({
    sub,
    iss,
    nbf,
    vcTypes: ['RIFGatewayProviderVerification'],
    credentialSubject: {
      verification: {
        type: 'ServiceProvider',
        name: 'Validation of Service Provider'
      }
    },
    ...res
  });
