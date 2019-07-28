import {Injectable} from '@angular/core';
import {createMnemonic, getSHA3hashSum} from './binance-crypto';
import {StorageService} from './storage.service';
import * as passworder from 'browser-passworder';
import {StateService} from './state.service';

@Injectable()
export class RegistrationService {
    mnemonic: any = null;
    private passHash: string;

    constructor(private storageService: StorageService, private stateService: StateService) {
    }

    get hasMnemonic(): boolean {
        return !!this.mnemonic;
    }

    generateMnemonic(): string {
        this.mnemonic = createMnemonic();
        return this.mnemonic;
    }

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

    async finishRegistration(repeatedPassword: string): Promise<boolean> {
        if (!this.isPasswordRepeatedCorrectly(repeatedPassword)) {
            return Promise.reject(false);
        }

        // await this.addAccount(this.mnemonic, repeatedPassword);
        // const privateKey = getPrivateKeyFromMnemonic(this.mnemonic);
        // const address = getAddressFromPrivateKey(privateKey);
        // const keystore = getKeystoreFromPrivateKey(privateKey, password);

        return new Promise(async (resolve) => {

            this.stateService.setPassword(repeatedPassword);

            const blob: ArrayBuffer = await passworder.encrypt(repeatedPassword, {seedPhrase: this.mnemonic});
            this.storageService.registerAccount(blob, getSHA3hashSum(repeatedPassword))
                .then(
                    () => {
                        this.cleanup();
                        resolve(true);
                    },
                    () => resolve(false)
                );
        });
    }

    // async finishImport(password: string): Promise<boolean> {
    //     this.addAccount(this.mnemonic, password);
    //     this.cleanup();
    //     return true;
    // }

}
