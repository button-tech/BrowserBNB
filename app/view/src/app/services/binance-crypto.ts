import * as Binance from '../../assets/binance/bnbSDK.js';

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

// Commented since we don't user it yet
// public static returnAddressFromKeystore(keystore: any, password  : string, networkType: string = 'bnb'): string {
//     const privateKey = BinanceCrypto.returnPrivateKeyFromKeystore(keystore, password);
//     return BinanceCrypto.returnAddressFromPrivateKey(privateKey, networkType);
// }

export function getAddressFromPrivateKey(privateKey: string, networkType: string = 'bnb'): string {
    console.assert(isNotEmptyString(privateKey));
    const publicKey = crypto.getPublicKeyFromPrivateKey(privateKey);
    return crypto.getAddressFromPublicKey(publicKey, networkType);
}

export function getPublicKeyFromPrivateKey(privateKey: string): string {
    return crypto.getPublicKeyFromPrivateKey(privateKey);
}

// // Commented since we don't user it yet
// public static returnAddressFromMnemonic(mnemonic: string, networkType: string = 'bnb'): string {
//     console.assert(isNotEmptyString(mnemonic));
//     const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic);
//     const publicKey = crypto.getPublicKeyFromPrivateKey(privateKey);
//     return crypto.getAddressFromPublicKey(publicKey, networkType);
// }

export function validateAddress(address: string, networkType: string = 'bnb'): boolean {
    if (isNotEmptyString(address)) {
        return crypto.checkAddress(address, networkType);
    }
}
