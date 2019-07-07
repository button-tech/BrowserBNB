/// <reference types="chrome"/>
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {filter, map, shareReplay, startWith, switchMap, switchMapTo, take, tap} from 'rxjs/operators';
import {concat, from, merge, Observable, of, Subject, Subscription} from 'rxjs';

export interface IStorageData {
    AccountList: IAccount[];
    CurrentAccountIdx: number;
}

export interface IAccount {
    address,
    privateKey,
    keystore,

    // TODO: implement this
    encryptedSeed: string;
    encryptedKeystore: string;
    accountName: string;
}

const STORAGE_KEY = 'all';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    storageData$: Observable<IStorageData>;
    currentAccount$: Observable<IAccount>;
    hasAccount$: Observable<boolean>;

    // Local storage setter, used in dev environment
    private lsSetter$: Subject<string> = new Subject<string>();
    private subscription: Subscription;

    // private _hasAccount: boolean;
    // get hasAccount() {
    //     return this._hasAccount;
    // }

    constructor() {

        const initial$ = of(1).pipe(
            switchMapTo( from(this.initStorage())),
            switchMapTo( from(this.getFromStorage())),
            // tap((x) => {
            //     console.log('hi!')
            // }),
            take(1)
        );

        const live$ = this.initStorageLister().pipe(
            map((jsonStr: string) => {
                return JSON.parse(jsonStr) as IStorageData;
            })
        );

        this.storageData$ = concat(initial$, live$).pipe(
            shareReplay(1)
        );

        // Launch pipeline right now
        this.subscription = this.storageData$.subscribe();

        this.hasAccount$ = this.storageData$.pipe(
            map((data: IStorageData) => {
                console.log('hasAccount$', data);
                return data.AccountList.length > 0;
            })
        );

        this.currentAccount$ = this.storageData$.pipe(
            filter((data) => {
                return data.AccountList.length > 0;
            }),
            map((data: IStorageData) => {
                const idx = data.CurrentAccountIdx;
                return data.AccountList[idx];
            })
        );
    }




    initStorageLister(): Observable<string> {

        if (!environment.production) {
            // Unfortunately localStorage listening doesn't work when you are emit events from the same page
            return this.lsSetter$.asObservable();
        }

        if (environment.production) {
            const s$: Subject<any> = new Subject();
            chrome.storage.onChanged.addListener((changes, namespace) => {
                if (namespace === 'local' && changes[STORAGE_KEY]) {
                    s$.next(changes[STORAGE_KEY].newValue);
                }
            });
            return s$.asObservable();
        }
    }

    async initStorage(): Promise<void> {
        let content: string = await this.getFromStorageRaw();
        if (!content) {
            const defaultValue: IStorageData = {
                AccountList: [],
                CurrentAccountIdx: 0
            };

            const jsonText = JSON.stringify(defaultValue);
            await this.saveToStorageRaw(jsonText);
            // content = await this.getFromStorage(STORAGE_KEY); //
        }

        // We also can patch / override object if
        // Validation - could be disabled in production
        // let obj: IStorageData;
        // obj = JSON.parse(content);
        // const isValid = (('AccountList' in obj) && ('CurrentAccountIdx' in obj));
        // console.assert(isValid);
    }

    saveToStorageRaw(value: string): Promise<void> {
        return new Promise<any>((resolve, reject) => {
            if (environment.production) {
                const cmd = {
                    [STORAGE_KEY]: value
                };
                chrome.storage.local.set(cmd, () => resolve());
            } else {
                localStorage.setItem(STORAGE_KEY, value);
                // Fire our fake localstorage listener
                this.lsSetter$.next(value);
                resolve();
            }
        });
    }

    saveToStorage(value: IStorageData): Promise<void> {
        const jsonStr = JSON.stringify(value);
        return this.saveToStorageRaw(jsonStr);
    }

    getFromStorageRaw(): Promise<string> {
        return new Promise<any>((resolve, reject) => {
            if (environment.production) {
                chrome.storage.local.get([STORAGE_KEY], (result) => {
                    resolve(result);
                });
            } else {
                const result = localStorage.getItem(STORAGE_KEY);
                resolve(result);
            }
        });
    }

    getFromStorage(): Promise<IStorageData> {
        return new Promise((resolve, reject) => {
            this.getFromStorageRaw().then((value: string) => {
                try {
                    resolve(JSON.parse(value));
                } catch (e) {
                    console.error('Malformed storage conetent');
                    reject(e);
                }
            });
        });

    }


    async addAccount(address, privateKey, keystore): Promise<void> {

        const data = await this.getFromStorage();
        const account: IAccount = {
            address,
            // TODO: don't stored it as plain text here
            privateKey,
            keystore,
            accountName: `Account ${data.AccountList.length + 1}`,
            // TODO: use this
            encryptedKeystore: '',
            encryptedSeed: '',
        };

        data.AccountList.push(account);
        data.CurrentAccountIdx = data.AccountList.length - 1;
        return this.saveToStorage(data);
    }

    reset(): Promise<void> {
        const defaultValue: IStorageData = {
            AccountList: [],
            CurrentAccountIdx: 0
        };

        const jsonText = JSON.stringify(defaultValue);
        return this.saveToStorageRaw(jsonText);
    }

    setNameForAccount$(accountNumber: number, newName: string) {

    }

    getAccountNumberByName$() {

    }

    getAllAccountNames$() {

    }

    getAccountByName$() {

    }


}
