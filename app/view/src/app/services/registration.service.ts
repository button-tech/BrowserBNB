import { Injectable } from '@angular/core';
import { createMnemonic, getSHA3hashSum } from './binance-crypto';
import { StorageService } from './storage.service';
import { StateService } from './state.service';

@Injectable()
export class RegistrationService {
    mnemonic: string = null;
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

    isPasswordRepeatedCorrectly(passwordRepeat: string): boolean {
        return this.passHash && this.passHash === getSHA3hashSum(passwordRepeat);
    }

    finishRegistration(repeatedPassword: string): boolean {
        if (!this.isPasswordRepeatedCorrectly(repeatedPassword)) {
            return false;
        }

        const data = this.storageService.registerAccount(this.mnemonic, repeatedPassword);
        this.stateService.initState(data, repeatedPassword);

        // cleanup - TODO: move at the component level
        this.mnemonic = null;
        this.passHash = null;

        return true;
    }

    // TODO: check how import works now
    // async finishImport(password: string): Promise<boolean> {
    //     this.addAccount(this.mnemonic, password);
    //     this.cleanup();
    //     return true;
    // }

}
