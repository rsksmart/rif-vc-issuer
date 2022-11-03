import { JwtCredentialPayload } from "did-jwt-vc";
import { JwtCredentialSubject } from "did-jwt-vc/lib/types";
import { ServiceType } from "../../../constants";
import { BaseVC, ServiceVerificationClaim, VerifyServiceVCArgs } from "../../types";

export const createServiceVerificationCredentialPayload = ({
    id,
    sub,
    iss,
    nbf,
    type,
    contractAddress,
    ...res
}: VerifyServiceVCArgs): JwtCredentialPayload => createVCTemplate<ServiceVerificationClaim>({
    id,
    sub,
    iss,
    nbf,
    vcTypes: ["RifServiceVerification"],
    credentialSubject: {
      serviceVerified: {
        type,
        contractAddress
      },
      ...res
    },
  });

  const createVCTemplate = <T extends JwtCredentialSubject>({
    id,
    sub,
    iss,
    nbf,
    vcTypes,
    credentialSubject,
    ...rest
  }: BaseVC<T>): JwtCredentialPayload => ({
    id,
    nbf,
    iss,
    sub,
    vc: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      issuanceDate: new Date(),
      type: ["VerifiableCredential", ...vcTypes],
      credentialSubject,
    },
  });