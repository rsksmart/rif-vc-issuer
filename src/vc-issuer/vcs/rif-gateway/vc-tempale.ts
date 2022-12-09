import { JwtCredentialPayload } from 'did-jwt-vc';
import { JwtCredentialSubject } from 'did-jwt-vc/lib/types';
import { BaseVC } from '../../types';

export const createVCTemplate = <T extends JwtCredentialSubject>({
  id,
  sub,
  iss,
  nbf,
  vcTypes,
  credentialSubject,
}: BaseVC<T>): JwtCredentialPayload => ({
  id,
  nbf,
  iss,
  sub,
  vc: {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    issuanceDate: new Date(),
    type: ['VerifiableCredential', ...vcTypes],
    credentialSubject,
  },
});
