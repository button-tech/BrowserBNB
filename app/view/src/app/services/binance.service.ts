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

    public static returnMnemonic(): string {
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

    public static returnKeystoreFromMnemonic() {
    };

    public static returnKeystoreFromPrivateKey() {
    };

    public static returnPrivateKeyFromKeystore() {
    };

    public static returnSHA3hashSum() {
    };

    public static returnAddressFromKeystore() {
    }

    public static returnAddressFromPrivateKey() {
    }

    public static returnAddressFromPublicKey() {
    }

    public static returnAddressFromMnemonic() {
    }

    public static validateAddress() {
    }

}

export class BinanceWeb {
}
