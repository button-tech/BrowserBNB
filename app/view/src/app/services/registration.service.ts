// src/app/auth/auth.service.ts
import {Injectable} from '@angular/core';
import {createMnemonic, getKeystoreFromPrivateKey, getPrivateKeyFromMnemonic, getSHA3hashSum} from './binance-crypto';
import {getAddressFromPrivateKey} from '../../assets/binance/bnbSDK';
import {StorageService} from './storage.service';

@Injectable()
export class RegistrationService {
    generatedMnemonic: any = null;
    importedMnemonic: any = null;

    constructor(private storageService: StorageService) {
    }

    get hasMnemonic(): boolean {
        return !!this.generatedMnemonic;
    }

    generateMnemonic(): string {
        this.generatedMnemonic = createMnemonic();
        return this.generatedMnemonic;
    }

    private passHash: string;

    set password(value: string) {
        this.passHash = getSHA3hashSum(value);
    }

    isPasswordRepeatedCorrectly(passwordRepeat: string) {
        return this.passHash && this.passHash == getSHA3hashSum(passwordRepeat);
    }

    cleanup() {
        this.generatedMnemonic = null;
        this.passHash = null; // ???
        this.importedMnemonic = null;
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

        await this.addAccount(this.generatedMnemonic, repeatedPassword);
        this.cleanup();
        return true;
    }

    async finishImport(password: string): Promise<boolean> {
        this.addAccount(this.importedMnemonic, password);
        this.cleanup();
        return true;
    }

}
