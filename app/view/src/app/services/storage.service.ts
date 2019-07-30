/// <reference types="chrome"/>
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {map, shareReplay, switchMap, take} from 'rxjs/operators';
import {concat, from, Observable, of, Subject, Subscription} from 'rxjs';
import {BinanceService} from './binance.service';
import * as passworder from 'browser-passworder';
import {getAddressFromPrivateKey, getPrivateKeyFromMnemonic, validateAddress} from './binance-crypto';
import {NETWORK_ENDPOINT_MAPPING} from './network_endpoint_mapping';


export type NetworkType = 'bnb' | 'tbnb' | null;

export interface IStorageAccount {
    addressMainnet: string;
    addressTestnet: string;
    privateKey: string;
    index: number
}

export interface IStorageData {
    seedPhrase: string | null;
    accounts: IStorageAccount[];
    selectedAddress: string | null;
    selectedNetwork: NetworkType;
    selectedNetworkEndpoint: string | null;
    address2name: { [address: string]: string }
}

// const emptyStorage: IStorageData = {
//     seedPhrase: null,
//     accounts: [],
//     selectedAddress: null,
//     selectedNetwork: null,
//     selectedNetworkEndpoint: null,
//     address2name: {}
// };

const STORAGE_KEY = 'all';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    // hasAccount$: Observable<boolean>;

    // Local storage setter, used in dev environment
    private lsSetter$: Subject<string> = new Subject<string>();

    constructor(private bncService: BinanceService) {

        // const initial$ = of(1).pipe(
        //     switchMap(() => from(this.initStorage())),
        //     switchMap(() => from(this.getFromStorage())),
        //     take(1)
        // );

        // const live$ = this.initStorageLister().pipe(
        //     map((jsonStr: string) => {
        //         return JSON.parse(jsonStr) as IStorageData;
        //     })
        // );

        // this.storageData$ = concat(initial$, live$).pipe(
        //     shareReplay(1)
        // );

        // this.hasAccount$ = this.storageData$.pipe(
        //     map((data: any) => !!data),
        //     shareReplay(1)
        // );

        // Launch pipeline right now
        // this.subscription = this.storageData$.subscribe();
    }

    hasAccountOnce$(): Observable<boolean> {
        return from(this.getFromStorageRaw()).pipe(
            map((encryptedData) => {
                return !!encryptedData;
            })
        );
    }

    // initStorageLister(): Observable<string> {
    //
    //     if (!environment.production) {
    //         // Unfortunately localStorage listening doesn't work when you are emit events from the same page
    //         return this.lsSetter$.asObservable();
    //     }
    //
    //     if (environment.production) {
    //         const subject$: Subject<any> = new Subject();
    //         chrome.storage.onChanged.addListener((changes, namespace) => {
    //             if (namespace === 'local' && changes[STORAGE_KEY]) {
    //                 subject$.next(changes[STORAGE_KEY].newValue);
    //             }
    //         });
    //         return subject$.asObservable();
    //     }
    // }

    // async initStorage(): Promise<void> {
    //     const content: string = await this.getFromStorageRaw();
    //     if (!content) {
    //         const jsonText = JSON.stringify(emptyStorage);
    //         return this.saveToStorageRaw(jsonText);
    //     }
    // }

    private saveToStorageRaw(value: string): Promise<void> {

        console.log('Save to storage:', value);

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

    private getFromStorageRaw(): Promise<string> {
        return new Promise<any>((resolve, reject) => {
            if (environment.production) {
                chrome.storage.local.get(STORAGE_KEY, (result) => resolve(result[STORAGE_KEY]));
            } else {
                const result = localStorage.getItem(STORAGE_KEY);
                resolve(result);
            }
        });
    }

    public getFromStorage(password: string): Observable<IStorageData> {
        return from(this.getFromStorageRaw()).pipe(
            switchMap((encrypted: any) => {
                return from(passworder.decrypt(password, encrypted));
            }),
            map((dectypted: any) => {
                return dectypted as IStorageData;
            })
        );
    }

    async encryptAndSave(data: IStorageData, password: string): Promise<void> {
        const encrypted: any = await passworder.encrypt(password, data);
        return this.saveToStorageRaw(encrypted);
    }

    registerAccount(seedPhrase: string, password: string): IStorageData {
        // Prepare account

        // tslint:disable-next-line:max-line-length
        // const seedPhrase = 'offer caution gift cross surge pretty orange during eye soldier popular holiday mention east eight office fashion ill parrot vault rent devote earth cousin';
        const privateKey = getPrivateKeyFromMnemonic(seedPhrase, 0);


        // tslint:disable-next-line:max-line-length
        // offer caution gift cross surge pretty orange during eye soldier popular holiday mention east eight office fashion ill parrot vault rent devote earth cousins
        const addressMainnet = getAddressFromPrivateKey(privateKey, 'bnb');
        const addressTestnet = getAddressFromPrivateKey(privateKey, 'tbnb');

        const address2name = {
            [addressMainnet]: `Account 1`,
            [addressTestnet]: `Account 1`
        };

        //
        const data: IStorageData = {
            seedPhrase,
            accounts: [
                {
                    addressMainnet,
                    addressTestnet,
                    privateKey,
                    index: 0
                }
            ],
            selectedAddress: addressMainnet,
            selectedNetwork: 'bnb',
            selectedNetworkEndpoint: NETWORK_ENDPOINT_MAPPING.MAINNET,
            address2name
        };

        // Promise result ignored by intend
        this.encryptAndSave(data, password);
        return data;
    }

    reset(): void {
        if (environment.production) {
            chrome.storage.local.clear(() => {
                let error = chrome.runtime.lastError;
                if (error) {
                    console.error(error);
                }
            });
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }
}
