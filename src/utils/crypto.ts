import {
  rskTestnetDIDFromPrivateKey,
  rskDIDFromPrivateKey,
} from '@rsksmart/rif-id-ethr-did';
import { randomBytes } from 'crypto';
import { ethers } from 'ethers';
import { EthrDID } from 'ethr-did';

import { fromRpcSig, hashPersonalMessage, ecrecover as _ecrecover, pubToAddress } from 'ethereumjs-util'

export const ecrecover = (msg: string, sig: string): string => {
  const { v, r, s } = fromRpcSig(sig)
  const msgHash = hashPersonalMessage(Buffer.from(msg))
  return `0x${pubToAddress(_ecrecover(msgHash, v, r, s)).toString('hex')}`
}

export const signMessage = (privateKey: string, hash: string) =>
  new ethers.Wallet(privateKey).signMessage(hash);
export const recoverSigner = (msg: string, signature: string) =>
  ecrecover(msg, signature);
export const getRandomBytesHex = (length = 32) =>
  randomBytes(length).toString('hex');
export const getAccountFromDID = (did): string =>
  did.split(':').slice(-1)[0].toLowerCase();
export const createIssuerIdentity = (privateKey, networkName = ''): EthrDID =>
  networkName === 'rsk:testnet'
    ? rskTestnetDIDFromPrivateKey()(privateKey)
    : rskDIDFromPrivateKey()(privateKey);


  // export const signMessage = (privateKey: string, hash: string) =>
  //   new ethers.Wallet(privateKey).signMessage(hash);
  // export const recoverSigner = (msg: string, signature: string) =>
  //   ethers.utils.verifyMessage(ethers.utils.id(msg), signature);
  // export const getRandomBytesHex = (length = 32) =>
  //   randomBytes(length).toString('hex');
  // export const getAccountFromDID = (did): string =>
  //   did.split(':').slice(-1)[0].toLowerCase();
  // export const createIssuerIdentity = (privateKey, networkName = ''): EthrDID =>
  //   networkName === 'rsk:testnet'
  //     ? rskTestnetDIDFromPrivateKey()(privateKey)
  //     : rskDIDFromPrivateKey()(privateKey);
