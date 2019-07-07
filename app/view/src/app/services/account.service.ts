import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {IAccount} from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class AccountService {

    // private currentKey = new BehaviorSubject('default key');
    // private keystore = new BehaviorSubject('default keystore');
    // private address = new BehaviorSubject('default address');
    // currentAddress = this.address.asObservable();
    // private account = new BehaviorSubject('default account');
    // private passwordHash = new BehaviorSubject('default password hash');
    // private mnemonic = new BehaviorSubject('default mnemonic');

    currentAccount$: Observable<IAccount>;

    constructor() {
        //
    }

    setPrivateKey(account: any, key: string) {

    }

    setMnemonic(account: any, mnemonic: string) {

    }

    setAddress(account: any, address: string) {

    }

    setCurrentKeystore(account: any, keystore: string) {

    }

    setPasswordHash(account: any, passwordHash: string) {

    }

    //--------

    getAddress(account: any): string {
        return this.address.value;
    }

    getMnemonic(account: any): string {
        return this.mnemonic.value;
    }

    getCurrentKey(account: any): string {
        return this.currentKey.value;
    }
    getCurrentKeystore(account: any): string {
        return this.keystore.value;
    }
    getCurrentPasswordHash(account: any): string {
        return this.passwordHash.value;
    }

}
