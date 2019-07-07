// src/app/auth/auth.service.ts
import {Injectable} from '@angular/core';
import {createMnemonic, getKeystoreFromPrivateKey, getPrivateKeyFromMnemonic, getSHA3hashSum} from './binance-crypto';
import {getAddressFromPrivateKey} from '../../assets/binance/bnbSDK';
import {AccountService} from './account.service';

@Injectable()
export class RegistrationService {
    mnemonic: any = null;
    importedMnemonic: any = null;

    constructor(accountService: AccountService) {
    }

    get hasMnemonic(): boolean {
        return !!this.mnemonic;
    }

    generateMnemonic(): any {
        this.mnemonic = createMnemonic();
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
        this.importedMnemonic = null
    }

    finishRegistration(passwordRepeat: string): Promise<boolean> {
        if (!this.isPasswordRepeatedCorrectly(passwordRepeat)) {
            return Promise.resolve(false);
        }
        this.cleanup();


        const privateKey = getPrivateKeyFromMnemonic(this.mnemonic);
        const address = getAddressFromPrivateKey(privateKey);
        const keystore = getKeystoreFromPrivateKey(privateKey, passwordRepeat);
        const jsonStr = JSON.stringify(keystore);

        // // TODO: check - maybe we shouldn't override storage, and show some warming in case we get some mnemonic but it isn't valid
        // memorySvc.setCurrentKey(privateKey);
        // memorySvc.setCurrentAddress(address);
        // memorySvc.setCurrentMnemonic(mnemonic);
        // this.memory.setCurrentKeystore(jsonStr);
        // this.memory.setPasswordHash(getSHA3hashSum(password));


        return Promise.resolve(true);
    }

    finishImport(password: string): Promise<boolean>{
        this.cleanup();

        const privateKey = getPrivateKeyFromMnemonic(this.mnemonic);
        const address = getAddressFromPrivateKey(privateKey);
        const keystore = getKeystoreFromPrivateKey(privateKey, password);
        const jsonStr = JSON.stringify(keystore);

        return Promise.resolve(true);
    }

}
