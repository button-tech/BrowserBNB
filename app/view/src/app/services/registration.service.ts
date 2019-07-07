import {Injectable} from '@angular/core';
import {createMnemonic, getKeystoreFromPrivateKey, getPrivateKeyFromMnemonic, getSHA3hashSum} from './binance-crypto';
import {getAddressFromPrivateKey} from '../../assets/binance/bnbSDK';
import {StorageService} from './storage.service';

@Injectable()
export class RegistrationService {
    mnemonic: any = null;

    constructor(private storageService: StorageService) {
    }

    get hasMnemonic(): boolean {
        return !!this.mnemonic;
    }

    generateMnemonic(): string {
        this.mnemonic = createMnemonic();
        return this.mnemonic;
    }

    private passHash: string;

    set password(value: string) {
        this.passHash = getSHA3hashSum(value);
    }

    isPasswordRepeatedCorrectly(passwordRepeat: string) {
        return this.passHash && this.passHash == getSHA3hashSum(passwordRepeat);
    }

    cleanup() {
        this.mnemonic = null;
        this.passHash = null;
    }

    // TODO: should be refactored - we won't store decrypted date in the storrage
    private addAccount(seedPhrase: string, password: string): Promise<boolean> {

        const privateKey = getPrivateKeyFromMnemonic(seedPhrase);
        const address = getAddressFromPrivateKey(privateKey);
        const keystore = getKeystoreFromPrivateKey(privateKey, password);

        return new Promise((resolve) => {
            this.storageService.addAccount(address, privateKey, keystore).then(() => {
                resolve(true);
            }, () => resolve(false));
        });
    }

    async finishRegistration(repeatedPassword: string): Promise<boolean> {
        if (!this.isPasswordRepeatedCorrectly(repeatedPassword)) {
            return Promise.reject(false);
        }

        await this.addAccount(this.mnemonic, repeatedPassword);
        this.cleanup();
        return true;
    }

    // async finishImport(password: string): Promise<boolean> {
    //     this.addAccount(this.mnemonic, password);
    //     this.cleanup();
    //     return true;
    // }

}
