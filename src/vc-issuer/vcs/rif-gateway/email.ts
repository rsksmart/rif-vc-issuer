import { JwtCredentialPayload } from 'did-jwt-vc';
import { CredentialArgs } from '../../types';
import { createVCTemplate } from './vc-tempale';

export type EmailAddressClaim = {
  emailAddress: string
}

export const createEmailCredentialPayload = ({
  sub,
  iss,
  nbf,
  emailAddress,
  ...res
}: CredentialArgs): JwtCredentialPayload =>
  createVCTemplate<EmailAddressClaim>({
    sub,
    iss,
    nbf,
    vcTypes: ['EmailVerification'],
    credentialSubject: {
      emailAddress,
    },
    ...res,
  });
