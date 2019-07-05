import {Injectable} from '@angular/core';
import * as Binance from '../../assets/binance/bnbSDK.js';

@Injectable({
    providedIn: 'root'
})
export class BinanceService {

    crypto: BinanceCrypto;

    constructor() {
        this.crypto = new BinanceCrypto()
    }
}

export class BinanceCrypto {

    public static createMnemonic(): string {
        let mnemonic: string;
        try {
            mnemonic = Binance.BNB.BNB.crypto.generateMnemonic();
        }
        catch (e) {
            console.error(`Error at binance.service.BinanceCrypto.returnMnemonic() ${e}`);
        }
        return BinanceCrypto._validateMnemonic(mnemonic);
    }

    public static validateMnemonic(mnemonic: string): boolean {
        return Binance.BNB.BNB.crypto.validateMnemonic(mnemonic)
    }

    private static _validateMnemonic(mnemonic: string): string {
        if (BinanceCrypto.validateMnemonic(mnemonic)) {
            return mnemonic;
        } else {
            console.error(`Error at binance.service.BinanceCrypto._validateMnemonic()`);
            return '';
        }
    }

    public static returnPrivateKeyFromMnemonic(mnemonic: string): string {
        if (mnemonic.length !== 0 && BinanceCrypto._validateMnemonic(mnemonic).length !== 0) {
            let privateKey: string;
            try {
                privateKey = Binance.BNB.BNB.crypto.getPrivateKeyFromMnemonic(mnemonic);
            }
            catch (e) {
                console.error(`Error at binance.service.BinanceCrypto.returnPrivateKeyFromMnemonic() ${e}`);
            }
            return privateKey;
        } else {
            return '';
        }
    }

    public static returnKeystoreFromMnemonic(mnemonic: string, password: string): any {
        if (BinanceCrypto._validateMnemonic(mnemonic) && password.length > 0) {
            const pvtKey = BinanceCrypto.returnPrivateKeyFromMnemonic(mnemonic);
            let keystore;
            try {
                keystore = Binance.BNB.BNB.crypto.generateKeyStore(pvtKey, password);
            }
            catch (e) {
                console.error(`Error at binance.service.BinanceCrypto.returnKeystoreFromMnemonic() ${e}`);
                return '';
            }
            return keystore;
        } else {
            return '';
        }
    };

    public static returnKeystoreFromPrivateKey(pvtKey: string, password: string) {
        let keystore;
        try {
            keystore = Binance.BNB.BNB.crypto.generateKeyStore(pvtKey, password);
        }
        catch (e) {
            console.error(`Error at binance.service.BinanceCrypto.returnKeystoreFromPrivateKey() ${e}`);
            return '';
        }
        return keystore;
    }


    public static returnPrivateKeyFromKeystore(keystore: any, password: string): string {
        let pvtKey;
        try {
            pvtKey = Binance.BNB.BNB.crypto.getPrivateKeyFromKeyStore(keystore, password);
        }
        catch (e) {
            console.error(`Error at binance.service.BinanceCrypto.returnPrivateKeyFromKeystore() ${e}`);
            return '';
        }
        return pvtKey;
    }


    public static returnSHA3hashSum(value: string): string {
        return Binance.BNB.BNB.utils.sha3(Binance.BNB.BNB.utils.str2hexstring(value))
    }


    public static returnAddressFromKeystore(keystore: any, password: string, networkType: string = 'bnb') {
        const pvtKey = BinanceCrypto.returnPrivateKeyFromKeystore(keystore, password);
        if (pvtKey.length === 0) {
            console.error(`Error at binance.service.BinanceCrypto.returnAddressFromKeystore() invalid pvtKey length`);
            return '';
        }

        const address = BinanceCrypto.returnAddressFromPrivateKey(pvtKey, networkType);
        if (address.length === 0) {
            console.error(`Error at binance.service.BinanceCrypto.returnAddressFromKeystore() invalid address length`);
            return '';
        }
        return address;
    }

    public static returnAddressFromPrivateKey(pvtKey: string, networkType: string = 'bnb'): string {
        const publicKey = BinanceCrypto.returnAddressFromPublicKey(pvtKey);
        if (publicKey.length === 0) {
            console.error(`Error at binance.service.BinanceCrypto.returnAddressFromPrivateKey() invalid publicKey length`);
            return '';
        }

        let address;
        try {
            address = Binance.BNB.BNB.crypto.getAddressFromPublicKey(publicKey, networkType);
        }
        catch (e) {
            console.error(`Error at binance.service.BinanceCrypto.returnAddressFromPrivateKey() ${e}`);
            return '';
        }

        return address;
    }

    public static returnAddressFromPublicKey(pvtKey: string): string {
        if (pvtKey.length === 0) {
            console.error(`Error at binance.service.BinanceCrypto.returnAddressFromPublicKey() invalid pvtKey length`);
            return '';
        }
        let publicKey;
        try {
            publicKey = Binance.BNB.BNB.crypto.getPublicKeyFromPrivateKey(pvtKey);
        } catch (e) {
            console.error(`Error at binance.service.BinanceCrypto.returnAddressFromPublicKey() ${e}`);
            return '';
        }
        return publicKey
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
        let result;
        try {
            result = Binance.BNB.BNB.crypto.checkAddress(address, networkType);
        }
        catch (e) {
            console.error(`Error at binance.service.BinanceCrypto.validateAddress() ${e}`);
            return false;
        }
        return result;
    }
}


export class BinanceWeb {

    getBalanceOfAccount() {

    }

    getBalanceOfToken() {

    }

    getTransactionsHistory() {
    }


}
