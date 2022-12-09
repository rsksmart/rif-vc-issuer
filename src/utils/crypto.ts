import {
  rskTestnetDIDFromPrivateKey,
  rskDIDFromPrivateKey,
} from '@rsksmart/rif-id-ethr-did';
import { randomBytes } from 'crypto';
import { ethers } from 'ethers';
import { EthrDID } from 'ethr-did';

export const signMessage = (privateKey: string, hash: string) =>
  new ethers.Wallet(privateKey).signMessage(hash);
export const recoverSigner = (msg: string, signature: string) =>
  ethers.utils.verifyMessage(ethers.utils.id(msg), signature);
export const getRandomBytesHex = (length = 32) =>
  randomBytes(length).toString('hex');
export const getAccountFromDID = (did): string =>
  did.split(':').slice(-1)[0].toLowerCase();
export const createIssuerIdentity = (privateKey, networkName = ''): EthrDID =>
  networkName === 'rsk:testnet'
    ? rskTestnetDIDFromPrivateKey()(privateKey)
    : rskDIDFromPrivateKey()(privateKey);
