export const VCIssuerDocSchema = {
    name: 'VCIssuer',
    requestVC: {
        operation: {
            operationId: 'requestVC',
            summary: 'Request a Verifiable Credential with the given payload'
        },
        body: {
            schema: {
              title: 'VCRequest',
              required: ['did','credentialType','credentialPayload','vcIssuanceChallenge','signature'],
              properties: {
                did: {
                  type: 'string',
                  description: 'provider DID',
                  example: 'did:ethr:rsk:0xc066f350A1E6a11dD2C243Bf62C07A4867601a03',
                  examples: { 
                    address: 'did:ethr:rsk:0xc066f350A1E6a11dD2C243Bf62C07A4867601a03',
                    pubKey:  'did:ethr:rsk:0xb319c8e204621d912e102b8e12b58a8d2f9ee7559bdb77a035960ca20dd37743'
                  }
                },
                credentialType: {
                    type: 'string',
                    description: 'Credential type to be issued',
                    enum: [''],
                    example: 'EmailVerification',
                },
                credentialPayload: {
                    type: 'object',
                    description: 'Payload to be embedded in the Verifiable Credential',
                    enum: [''],
                    example: '{ email: "xzy@example.com" }',
                },
                vcIssuanceChallenge: {
                    type: 'string',
                    description: 'Hex string challenge created by the RIF Gateway',
                    example: '0x9373225c765ccb35e324982ea7a9407ace95825ec186ed5cbe8847bbd6644724',
                },
                signature: {
                    type: 'string',
                    description: 'Hex string signature, representing the signed `vcIssuanceChallenge` created by the RIF Gateway',
                    example: '0xa69b7cee132914d5e1b6e9fdc57555d537a33d0d79c18b04b2e784e276ada0da79eb193a148b20f91c99ff9019e3fd873bc2c6d311ecc19e3cc400124a0c89631c',
                }
              }
            }
        },
        response: {
            schema: {
                title: 'RegistrationData',
                properties: {
                    jwt: {
                        type: 'string',
                        description: 'JWT verified credential generated by the issuer',
                        example: '0xbba2eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c74e8c921f7bea1cd0b2f7e3a1ca496e8baed17e11a55a51b4511f6d5111e'
                    }
                }
            }
        }
    },
    verifyCredential: {
        operation: {
            operationId: 'verifyCredential',
            summary: 'Verifies a JWT Verifiable Credential using te vc registry'
        },
        body: {
            schema: {
              title: 'VerifyVCRequest',
              required: ['jwt'],
              properties: {
                jwt: {
                    type: 'string',
                    description: 'JWT verified credential generated by the issuer',
                    example: '0xbba2eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c74e8c921f7bea1cd0b2f7e3a1ca496e8baed17e11a55a51b4511f6d5111e'
                }
              }
            }
        },
        response: {
            schema: {
                title: 'RegistrationData',
                properties: {
                    payload: {
                        type: 'object',
                        description: 'the original payload of the signed credential',
                    },
                    doc: {
                        type: 'object',
                        description: 'the DID document of the credential issuer (as returned by the `resolver`)',
                    },
                    signer: {
                        type: 'string',
                        description: 'the publicKey entry of the `doc` that has signed the credential',
                        example: '0xbba274e8c921f7bea1cd0b2f7e3a1ca496e8baed17e11a55a51b4511f6d5111e'
                    },
                    jwt: {
                        type: 'string',
                        description: 'the original credential',
                        example: '1671683032264'
                    },
                    verifiableCredential: {
                        type: 'object',
                        description: 'parsed payload aligned to the W3C data model',
                    }
                }
            }
        }
    }
}; 