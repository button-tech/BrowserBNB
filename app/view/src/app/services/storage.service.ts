/// <reference types="chrome"/>
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {filter, map, shareReplay, switchMap, take} from 'rxjs/operators';
import {BehaviorSubject, concat, from, Observable, of, Subject, Subscription} from 'rxjs';
import {BinanceService} from "./binance.service";

export interface IStorageData {
    SeedPhrase: ArrayBuffer;
    CurrentAccountIdx: number;
    PassHash: string;
}

const STORAGE_KEY = 'all';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    storageData$: Observable<IStorageData>;
    hasAccount$: Observable<boolean>;

    // Local storage setter, used in dev environment
    private lsSetter$: Subject<string> = new Subject<string>();
    private subscription: Subscription;

    // private _hasAccount: boolean;
    // get hasAccount() {
    //     return this._hasAccount;
    // }

    constructor(private bncService: BinanceService) {

        const initial$ = of(1).pipe(
            switchMap(() => from(this.initStorage())),
            switchMap(() => from(this.getFromStorage())),
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

        this.hasAccount$ = this.storageData$.pipe(
            map((data: IStorageData) => {
                return data.AccountList.length > 0;
            })
        );

        // Launch pipeline right now
        this.subscription = this.storageData$.subscribe();
    }


    initStorageLister(): Observable<string> {

        if (!environment.production) {
            // Unfortunately localStorage listening doesn't work when you are emit events from the same page
            return this.lsSetter$.asObservable();
        }

        if (environment.production) {
            const subject$: Subject<any> = new Subject();
            chrome.storage.onChanged.addListener((changes, namespace) => {
                if (namespace === 'local' && changes[STORAGE_KEY]) {
                    subject$.next(changes[STORAGE_KEY].newValue);
                }
            });
            return subject$.asObservable();
        }
    }

    async initStorage(): Promise<void> {
        const content: string = await this.getFromStorageRaw();
        if (!content) {
            const defaultValue: IStorageData = {
                SeedPhrase: new ArrayBuffer(0),
                CurrentAccountIdx: 0,
                PassHash: ''
            };

            const jsonText = JSON.stringify(defaultValue);
            return this.saveToStorageRaw(jsonText);
        }
    }

    saveToStorageRaw(value: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (environment.production) {
                const cmd = {
                    [STORAGE_KEY]: value
                };
                chrome.storage.local.set(cmd, resolve);
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
                chrome.storage.local.get(STORAGE_KEY, (result) => resolve(result[STORAGE_KEY]));
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

    async updateStorage(data: IStorageData): Promise<void> {
        // const data: IStorageData = await this.getFromStorage();
        // data.AccountList[index] = account;
        return this.saveToStorage(data);
    }

    // async updateAccount(index: number, account: IAccount): Promise<void> {
    //     // const data: IStorageData = await this.getFromStorage();
    //     data.AccountList[index] = account;
    //     return this.saveToStorage(data);
    // }

    async registerAccount(blob: ArrayBuffer, passHash: string): Promise<void> {

        // const data: IStorageData = await this.getFromStorage();
        // const account: IAccount = {
        //     address,
        //     // TODO: don't stored it as plain text here
        //     privateKey,
        //     keystore,
        //     accountName: `Account ${data.AccountList.length + 1}`,
        //     // TODO: use this
        //     encryptedKeystore: '',
        //     encryptedSeed: '',
        // };
        //
        // data.PassHash = passHash;
        // data.AccountList.push(account);
        // data.CurrentAccountIdx = data.AccountList.length - 1;

        const data: IStorageData = {
            SeedPhrase: blob,
            CurrentAccountIdx: 0,
            PassHash: passHash
        };

        //

        const jsonText = JSON.stringify(data);
        // await this.saveToStorage(data);
        this.saveToStorageRaw(jsonText);
    }

    reset(): Promise<void> {
        const defaultValue: IStorageData = {
            SeedPhrase: new ArrayBuffer(0),
            CurrentAccountIdx: 0,
            PassHash: ''
        };

        const jsonText = JSON.stringify(defaultValue);
        return this.saveToStorageRaw(jsonText);
    }
}
