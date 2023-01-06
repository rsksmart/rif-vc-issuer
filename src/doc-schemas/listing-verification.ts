export const ListingVerificationDocSchema = {
    name: 'ListingVerification',

    getVerificationById: {
        operation: {
            operationId: 'getVerificationById',
            summary: 'Get a verification record by ID'
        },
        parameters: {
            name: 'registrationId',
            schema: {
                type: 'string',
                description: 'hex string',
                example: '0xbba274e8c921f7bea1cd0b2f7e3a1ca496e8baed17e11a55a51b4511f6d5111e',
            }
        }
    },
    requestVerification: {
        operation: {
            operationId: 'requestVerification',
            summary: 'Request verification for the given provider, action made by the provider'
        },
        body: {
            schema: {
              title: 'RequestVerificationResponse',
              required: ['did','email'],
              properties: {
                email: {
                  type: 'string',
                  description: 'provider email',
                  example: 'xzy@example.com',
                },
                did: {
                  type: 'string',
                  description: 'provider DID',
                  example: 'did:ethr:rsk:0xc066f350A1E6a11dD2C243Bf62C07A4867601a03',
                  examples: { 
                    address: 'did:ethr:rsk:0xc066f350A1E6a11dD2C243Bf62C07A4867601a03',
                    pubKey:  'did:ethr:rsk:0xb319c8e204621d912e102b8e12b58a8d2f9ee7559bdb77a035960ca20dd37743'
                  }
                }
              }
            }
        },
        response: {
            schema: {
                title: 'RegistrationData',
                properties: {
                    did: {
                        type: 'string',
                        description: 'provider did',
                    },
                    email: {
                        type: 'string',
                        description: 'provider email',
                    },
                    verificationChallenge: {
                        type: 'string',
                        description: 'Hex string challenge created by the rif-vc-service meant to be signed further in the process by the provider',
                        example: '0xbba274e8c921f7bea1cd0b2f7e3a1ca496e8baed17e11a55a51b4511f6d5111e'
                    },
                    verificationExpirationDate: {
                        type: 'string',
                        description: 'Expiration of the verification request record in the system if it is never validated',
                        example: '1671683032264'
                    },
                    status: {
                        type: 'string',
                        description: 'Status of the verification request',
                        enum: [''],
                        example: 'created'
                    },
                    registrationId: {
                        type: 'string',
                        description: 'ID of the verification request',
                        example: '0xbba274e8c921f7bea1cd0b2f7e3a1ca496e8baed17e11a55a51b4511f6d5111e'
                    }
                }
            }
        }
    },
    verify: {
        operation: {
            operationId: 'verify',
            summary: 'Verify a provider verification request, action made by the RIF Gateway'
        },
        body: {
            schema: {
                title: 'Verify',
                required: ['registrationId', 'accepted'],
                properties: {
                    registrationId: {
                        type: 'string',
                        description: 'ID of the verification request',
                        example: '0xbba274e8c921f7bea1cd0b2f7e3a1ca496e8baed17e11a55a51b4511f6d5111e'
                    },
                    accepted: {
                        type: 'boolean',
                        description: '"true" if provider is accepted by the RIF Gateway, false if rejected',
                        example: 'true'
                    }
                }
            }
        }
    },
    acknowledgeVerification: {
        operation: {
            operationId: 'acknowledgeVerification',
            summary: 'Acknowledge verification response, action made by the provider'
        },
        body: {
            schema: {
                title: 'AcknowledgeVerification',
                required: ['registrationId', 'signature'],
                properties: {
                    registrationId: {
                        type: 'string',
                        description: 'ID of the verification request',
                        example: '0xbba274e8c921f7bea1cd0b2f7e3a1ca496e8baed17e11a55a51b4511f6d5111e'
                    },
                    signature: {
                        type: 'string',
                        description: 'Hex string signature, this signature is the result of signing the `verificationChallenge` property',
                        example: '0xa51d9c6c284aedadc4d5e2f45ae415b4a21bbdc8b77e2efef1eadf7a221e5a274844d7699dac9a5a1dc72734dca58f6288b8e3562e0bd90becc11f46dd6f88511b'
                    }
                }
            }
        },
        response: {
            schema: {
                title: 'AcknowledgeResponse',
                properties: {
                    vcEmail: {
                        type: 'string',
                        description: 'Email Verifiable credential encoded in JWT',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
                    },
                    vcProvider: {
                        type: 'string',
                        description: 'Service Provider Verifiable credential encoded in JWT',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
                    }
                }
            }
        }
    }
}; 