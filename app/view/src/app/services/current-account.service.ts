// import {Injectable} from '@angular/core';
// import {BehaviorSubject, Observable} from 'rxjs';
// import {IAccount} from './storage.service';
// import {AccountService} from './account.service';
//
// @Injectable({
//     providedIn: 'root'
// })
// export class CurrentAccountService {
//
//     currentAccount$: Observable<IAccount>;
//     account: IAccount = null;
//
//     constructor(accountService: AccountService) {
//         // Just unsubscibe later ???
//         this.currentAccount$.subscribe((account) => {
//             this.account = account;
//         });
//     }
//
//     private _privateKey: string;
//     get privateKey(): string {
//         return this._privateKey;
//     }
//     set privateKey(value: string) {
//         this._privateKey = value;
//     }
//
//
//     private _mnemonic: string;
//     get mnemonic(): string {
//         return this._mnemonic;
//     }
//     set mnemonic(value: string) {
//         this._mnemonic = value;
//     }
//
//
//     private _address: string;
//     get address(): string {
//         return this._address;
//     }
//     set address(value: string) {
//         this._address = value;
//     }
//
//
//     private _keystore: string;
//     get keystore(): string {
//         return this._keystore;
//     }
//     set keystore(value: string) {
//         this._keystore = value;
//     }
//
//
//     private _passwordHash: string;
//     get passwordHash(): string  {
//         return this._passwordHash;
//     }
//     set passwordHash(value: string) {
//         this._passwordHash = value;
//     }
// }
