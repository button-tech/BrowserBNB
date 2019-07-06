import {Injectable} from '@angular/core';
import * as Binance from '../../assets/binance/bnbSDK.js';


@Injectable({
    providedIn: 'root'
})
export class BinanceService {

    constructor() {
    }
}

export class BinanceCrypto {

    private static binanceInstance = Binance.initBNB();

    public static createMnemonic(): string {
        let mnemonic: string;
        try {
            mnemonic = this.binanceInstance.crypto.generateMnemonic();
        } catch (e) {
            console.error(`Error at binance.service.BinanceCrypto.returnMnemonic() ${e}`);
        }
        return BinanceCrypto._validateMnemonic(mnemonic);
    }

    public static validateMnemonic(mnemonic: string): boolean {
        return this.binanceInstance.crypto.validateMnemonic(mnemonic);
    }

    private static _validateMnemonic(mnemonic: string): string {

        if (BinanceCrypto.validateMnemonic(mnemonic)) {
            return mnemonic;
        }

        console.error(`Error at binance.service.BinanceCrypto._validateMnemonic() Mnemonic is incorrect`);
        return '';
    }

    public static returnPrivateKeyFromMnemonic(mnemonic: string): string {

        if (!mnemonic) {
            console.error(`mnemonic can't be '${mnemonic}'`);
            return '';
        }

        if (BinanceCrypto._validateMnemonic(mnemonic).length === 0) {
            return '';
        }

        try {
            return this.binanceInstance.crypto.getPrivateKeyFromMnemonic(mnemonic);
        } catch (e) {
            console.error(`Error at binance.service.BinanceCrypto.returnPrivateKeyFromMnemonic() ${e}`);
            return '';
        }
    }

    public static returnKeystoreFromMnemonic(mnemonic: string, password: string): any {
        if (!password) {
            console.error(`Password can't be '${password}'`);
            return '';
        }

        if (!BinanceCrypto._validateMnemonic(mnemonic)) {
            console.error(`Error at binance.service.BinanceCrypto.returnKeystoreFromMnemonic() invalid Mnemonic`);
            return '';
        }

        const pvtKey = BinanceCrypto.returnPrivateKeyFromMnemonic(mnemonic);
        const keystore = BinanceCrypto.returnKeystoreFromPrivateKey(pvtKey, password);
        if (keystore === '') {
            return '';
        }

    };

    public static returnKeystoreFromPrivateKey(pvtKey: string, password: string): any {
        if (!password) {
            console.error(`Error at binance.service.BinanceCrypto.returnKeystoreFromPrivateKey() password length is '${password}'`);
            return '';
        }

        if (!pvtKey) {
            console.error(`Error at binance.service.BinanceCrypto.returnKeystoreFromPrivateKey() pvtKey is invalid '${pvtKey}'`);
            return '';
        }

        try {
            // Actual call and return is here
            return this.binanceInstance.crypto.generateKeyStore(pvtKey, password);
        } catch (e) {
            console.error(`Error at binance.service.BinanceCrypto.returnKeystoreFromPrivateKey() ${e}`);
        }

        return '';
    }

    public static returnPrivateKeyFromKeystore(keystore: any, password: string): string {
        let pvtKey;
        try {
            pvtKey = this.binanceInstance.crypto.getPrivateKeyFromKeyStore(keystore, password);
        } catch (e) {
            console.error(`Error at binance.service.BinanceCrypto.returnPrivateKeyFromKeystore() ${e}`);
            return '';
        }
        return pvtKey;
    }

    public static returnSHA3hashSum(value: string): string {
        return this.binanceInstance.utils.sha3(this.binanceInstance.utils.str2hexstring(value));
    }

    public static returnAddressFromKeystore(keystore: any, password: string, networkType: string = 'bnb'): string {
        const pvtKey = BinanceCrypto.returnPrivateKeyFromKeystore(keystore, password);
        if (pvtKey.length === 0) {
            console.error(`Error at binance.service.BinanceCrypto.returnAddressFromKeystore() invalid pvtKey length`);
            return '';
        }

        const address = BinanceCrypto.returnAddressFromPrivateKey(pvtKey, networkType);
        if (address.length === 0) {
            console.error(`Error at binance.service.BinanceCrypto.returnAddressFromKeystore() address length is 0`);
            return '';
        }

        return address;
    }

    public static returnAddressFromPrivateKey(pvtKey: string, networkType: string = 'bnb'): string {
        const publicKey = BinanceCrypto.returnPublicKeyFromPrivateKey(pvtKey);
        if (publicKey.length === 0) {
            console.error(`Error at binance.service.BinanceCrypto.returnAddressFromPrivateKey() invalid publicKey length`);
            return '';
        }

        try {
            return this.binanceInstance.crypto.getAddressFromPublicKey(publicKey, networkType);
        } catch (e) {
            console.error(`Error at binance.service.BinanceCrypto.returnAddressFromPrivateKey() ${e}`);
        }
        return '';
    }

    public static returnPublicKeyFromPrivateKey(pvtKey: string): string {
        if (pvtKey.length === 0) {
            console.error(`Error at binance.service.BinanceCrypto.returnAddressFromPublicKey() invalid pvtKey length`);
            return '';
        }

        try {
            return this.binanceInstance.crypto.getPublicKeyFromPrivateKey(pvtKey);
        } catch (e) {
            console.error(`Error at binance.service.BinanceCrypto.returnAddressFromPublicKey() ${e}`);
        }

        return '';
    }

    public static returnAddressFromMnemonic(mnemonic: string, networkType: string = 'bnb'): string {
        if (mnemonic.length === 0) {
            console.error(`Error at binance.service.BinanceCrypto.returnAddressFromMnemonic() invalid mnemonic length`);
            return '';
        }

        const pvtKey = BinanceCrypto.returnPrivateKeyFromMnemonic(mnemonic);
        if (pvtKey.length === 0) {
            console.error(`Error at binance.service.BinanceCrypto.returnAddressFromMnemonic() invalid pvtKey length`);
            return '';
        }

        const address = BinanceCrypto.returnAddressFromPrivateKey(pvtKey, networkType);
        if (address.length === 0) {
            console.error(`Error at binance.service.BinanceCrypto.returnAddressFromMnemonic() invalid address length`);
            return '';
        }

        return address;
    }

    public static validateAddress(address: string, networkType: string = 'bnb'): boolean {
        if (address.length === 0) {
            console.error(`Error at binance.service.BinanceCrypto.validateAddress() invalid address length`);
            return false;
        }

        try {
            return this.binanceInstance.crypto.checkAddress(address, networkType);
        } catch (e) {
            console.error(`Error at binance.service.BinanceCrypto.validateAddress() ${e}`);
        }

        return false;
    }

}
