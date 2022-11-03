import { Injectable } from '@nestjs/common';
import { createVerifiableCredentialJwt, Issuer } from 'did-jwt-vc';
import { EthrDID } from 'ethr-did';
import { signMessage } from '../../utils/crypto';
import { VcRequest } from '../types';
import { createServiceVerificationCredentialPayload } from '../vcs/rif-gateway/service-validated';

@Injectable()
export class IssueVcService {

    private issuers: Map<string, Issuer>;

    constructor (){
        this.issuers = new Map();
        const issuer = new EthrDID({
            identifier: process.env.ISSUER_ADDR,
            privateKey: process.env.ISSUER_PRIV_KEY,
            alg: 'ES256K',
            signer: (data: string) => signMessage(process.env.ISSUER_PRIV_KEY, data)
        }) as Issuer;

        this.issuers.set(process.env.ISSUER_ADDR, issuer);
    }

    async issueVc({ credentialPayload, vcIssuanceChallenge, did: sub, signature }: VcRequest) {
        const payload = createServiceVerificationCredentialPayload({ 
            ...credentialPayload,
            iss: process.env.ISSUER_ADDR,
            sub,
            nbf: new Date().getSeconds(),
            id: '', // TODO: credential id,
            proof: {
                type: 'JwtProof2020',
                challenge: vcIssuanceChallenge,
                jws: signature
            }
        });
        console.log("🚀 ~ file: issue-vc.service.ts ~ line 36 ~ IssueVcService ~ issueVc ~ payload", payload)

        const jwt = await createVerifiableCredentialJwt(
            payload,
            this.issuers.get(process.env.ISSUER_ADDR)
        );

        console.log("🚀 ~ file: issue-vc.service.ts ~ line 45 ~ IssueVcService ~ issueVc ~ jws", jwt)

        return { jwt };
    }
}