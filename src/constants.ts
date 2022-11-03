export const TTL_CACHE = 10000000;
export const DEFAULT_VERSION = '1';
export const PORT = 3000;
export const BASE_URL = `http://localhost:${PORT}/v${DEFAULT_VERSION}`;
export type ServiceType =  'Lending' | 'Borrowing';
export const SIGNATURE_MSG = 'RIF Gateway Signed Message:\n';