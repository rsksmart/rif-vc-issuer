export const serviceVerificationStatus = {
  created: 'created',
  underReview: 'underReview',
  pendingConfirmation: 'pendingConfirmation',
  verified: 'verified',
  rejected: 'rejected',
} as const;

export type ServiceVerificationStatus = keyof typeof serviceVerificationStatus;
