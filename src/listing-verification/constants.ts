export const serviceVerificationStatus = {
  registered: 'registered',
  underReview: 'underReview',
  verified: 'verified',
  rejected: 'rejected',
} as const;

export type ServiceVerificationStatus = keyof typeof serviceVerificationStatus;
