import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MemoryService {

    private currentKey = new BehaviorSubject('default key');
    private keystore = new BehaviorSubject('default keystore');
    private address = new BehaviorSubject('default address');
    currentAddress = this.address.asObservable();
    private account = new BehaviorSubject('default account');
    private passwordHash = new BehaviorSubject('default password hash');

    constructor() {
    }

    setCurrentKey(key: string) {
        this.currentKey.next(key);
    }

    setCurrentAddress(address: string) {
        this.address.next(address);
    }

    setCurrentKeystore(keystore: string) {
        this.keystore.next(keystore);
    }


    setPasswordHash(passwordHash: string) {
        this.passwordHash.next(passwordHash);
    }

    getCurrentAddress(): string {
        return this.address.value;
    }

    getCurrentKey(): string {
        return this.currentKey.value;
    }
    getCurrentKeystore(): string {
        return this.keystore.value;
    }
    getCurrentPasswordHash(): string {
        return this.passwordHash.value;
    }

}
