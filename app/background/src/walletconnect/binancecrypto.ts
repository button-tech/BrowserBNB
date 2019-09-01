/*
 * MIT License
 *
 * Copyright (c) 2019 BUTTON Wallet
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */
// @ts-ignore
import * as Binance from '../../../view/src/assets/binance/bnbSDK.js';
import {ISignedTransaction} from "./types";

const isNotEmptyString = (str: string | any): boolean => {
    return !!str && (typeof str === 'string' || str instanceof String);
};

const binanceInstance = Binance.BNB;
const crypto = binanceInstance.crypto;
const utils = binanceInstance.utils;

export function createMnemonic(): string {
    return crypto.generateMnemonic();
}

export function isValidMnemonic(mnemonic: string): boolean {
    return crypto.validateMnemonic(mnemonic);
}

export function getPrivateKeyFromMnemonic(mnemonic: string, index: number = 0): string {
    console.assert(isNotEmptyString(mnemonic));
    return crypto.getPrivateKeyFromMnemonic(mnemonic, true, index);
}

export function getKeystoreFromMnemonic(mnemonic: string, password: string): any {
    console.assert(isNotEmptyString(mnemonic) && isNotEmptyString(password));
    const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic);
    return crypto.generateKeyStore(privateKey, password);
}

export function getKeystoreFromPrivateKey(privateKey: string, password: string): any {
    console.assert(isNotEmptyString(privateKey) && isNotEmptyString(password));
    return crypto.generateKeyStore(privateKey, password);
}

export function getPrivateKeyFromKeystore(keystore: any, password: string): string {
    console.assert(!!keystore && isNotEmptyString(password));
    return crypto.getPrivateKeyFromKeyStore(keystore, password);
}

export function getSHA3hashSum(value: string): string {
    const hexStr = utils.str2hexstring(value);
    return utils.sha3(hexStr);
}

export function getAddressFromPrivateKey(privateKey: string, networkType: string = 'bnb'): string {
    console.assert(isNotEmptyString(privateKey));
    const publicKey = crypto.getPublicKeyFromPrivateKey(privateKey);
    return crypto.getAddressFromPublicKey(publicKey, networkType);
}

export function getPublicKeyFromPrivateKey(privateKey: string): string {
    return crypto.getPublicKeyFromPrivateKey(privateKey);
}

export function validateAddress(address: string, networkType: string = 'bnb'): boolean {
    if (isNotEmptyString(address)) {
        return crypto.checkAddress(address, networkType);
    }
    return false;
}

export function signTransaction(privKey: string, rawTransaction: any): ISignedTransaction {
    // TODO: need checks for  rawTransaction and  privKey also error handling
    const publicKey = crypto.getPublicKeyFromPrivateKey(privKey);
    const msg = Buffer.from(JSON.stringify(rawTransaction)).toString("hex");
    const signature = crypto.generateSignature(msg, privKey).toString("hex");

    return {publicKey, signature};
}


