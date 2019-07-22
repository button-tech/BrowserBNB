import {Injectable} from '@angular/core';
import {IAccount, IStorageData, StorageService} from './storage.service';
import {filter, tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CurrentAccountService {

    account: IAccount = null;
    index: number = null;
    private storageData: IStorageData;

    constructor(private storageService: StorageService) {
        this.storageService.storageData$.pipe(
            filter((data) => {
                return data.AccountList.length > 0;
            }),
            tap((data: IStorageData) => {
                this.storageData = data;
                this.index = data.CurrentAccountIdx;
                this.account = this.storageData.AccountList[this.index];
            })
        ).subscribe();
    }

    get accountName(): string {
        return this.account.accountName;
    }

    set accountName(value: string) {
        this.account.accountName = value;

        this.storageData.AccountList[this.index] = this.account;
        this.storageService.updateStorage(this.storageData);
    }

    // private _privateKey: string;
    // get privateKey(): string {
    //     return this._privateKey;
    // }
    //
    // set privateKey(value: string) {
    //     this._privateKey = value;
    // }
    //
    //
    // private _mnemonic: string;
    // get mnemonic(): string {
    //     return this._mnemonic;
    // }
    //
    // set mnemonic(value: string) {
    //     this._mnemonic = value;
    // }
    //
    //
    // private _address: string;
    // get address(): string {
    //     return this._address;
    // }
    //
    // set address(value: string) {
    //     this._address = value;
    // }
    //
    //
    // private _keystore: string;
    // get keystore(): string {
    //     return this._keystore;
    // }
    //
    // set keystore(value: string) {
    //     this._keystore = value;
    // }
    //
    //
    // private _passwordHash: string;
    // get passwordHash(): string {
    //     return this._passwordHash;
    // }
    //
    // set passwordHash(value: string) {
    //     this._passwordHash = value;
    // }


}
