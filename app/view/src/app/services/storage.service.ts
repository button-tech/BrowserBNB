/// <reference types="chrome"/>
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {map, shareReplay} from 'rxjs/operators';
import {from, merge, Observable, of, Subject} from 'rxjs';

export interface IStorageData {
    AccountList: IAccount[];
    CurrentAccountIdx: number;
    IsInitialized: boolean;
}

export interface IAccount {
    encryptedSeed: string;
    encryptedKeystore: string;
    accountName: string;
}

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    // TODO: test this
    private s$: Subject<any> = new Subject();
    storageData$: Observable<IStorageData>;

    constructor() {

        // if (environment.production) {
        //     chrome.storage.onChanged.addListener((changes, namespace) => {
        //         const x = {
        //             namespace,
        //             changes
        //         };
        //         this.s$.next(x);
        //     });
        // } else {
        //     window.addEventListener('storage', (e: any) => {
        //         const x = {
        //             namespace: 'local',
        //             changes: e.newValue
        //         };
        //         this.s$.next(x);
        //     });
        // }
        //
        // const initial$ = this.get$('all');
        //
        // const live$ = of(1);
        // this.storageData$ = merge(initial$, live$).pipe(
        //     map( () => {
        //         return {
        //             AccountList: IAccount[];
        //             CurrentAccountIdx: number;
        //             IsInitialized: boolean;
        //         }
        //     }),
        //     shareReplay(1)
        // );
        //
        // //     const liveAll$ = s$.pipe(
        // //         filter((x) => {
        // //             const {namespace, changes} = x;
        // //             return namespace === 'local' && changes.all;
        // //         }),
        // //         map((x) => {
        // //             const {changes} = x;
        // //             try {
        // //                 return JSON.parse(changes.all);
        // //             }
        // //             cath(err);
        // //             {
        // //                 return changes.all;
        // //             }
        // //         }),
        // //     );
        // //
        // //     const res = merge(initial$, live$).pipe(
        // //         shareReplay(1)
        // //     );
        // //
        // //
        // //
        // //     set(value);
        // // :
        // //     void {
        // //         this.all$.take(1).subscribe((currentAllValue) => {
        // //
        // //             cosnt;
        // //             newValue = {
        // //                 ...currentAllValue
        // //                 ...value
        // //             };
        // //
        // //             const newJsonValue = JSON.stringify(newValue);
        // //         };
        // //     chrome.storage.local.set({
        // //         'all': newJsonValue,(x)
        // // =>
        // //     {
        // //         // console.log('saved')
        // //     }
        // // )
        // // })
    }

    // Set specific key, under 'all' object
    set(key: string, value: any): Promise<string> {
        return new Promise<any>((resolve, reject) => {
            if (environment.production) {
                chrome.storage.local.get([key], (result) => {
                    resolve(result);
                });
            } else {
                resolve(localStorage.getItem(key));
            }
        });

        return new Promise((resolve, reject) => {
            const jsonText = JSON.stringify(value);
            chrome.storage.local.set({all: jsonText}, () => resolve('saved'));
        });
    }

    // Rx wrapper on promise
    set$(value: any): Observable<string> {
        //const promise = this.set(value);
        const promise = new Promise<string>(() => {});
        return from(promise);
    }

    // Key in storage
    getFromStorage(key: string): Promise<string> {
        return new Promise<any>((resolve, reject) => {
            if (environment.production) {
                chrome.storage.local.get([key], (result) => {
                    resolve(result);
                });
            } else {
                resolve(localStorage.getItem(key));
            }
        });
    }

    // Key in object mapped under 'All' key
    async get(key: string): Promise<any> {
        this.getFromStorage('all').then((value: string | undefined) => {
            try {
                const obj = JSON.parse(value);
                return obj && obj[value];
            } catch (e) {
                return value;
            }
        });
    }

    // Rx wrapper on promise
    // Key in object mapped under 'All' key
    get$(key: string): Observable<string> {
        return from(this.get(key));
    }

    async reset(): Promise<void> {
        return new Promise((resolve) => {
            if (environment.production) {
                chrome.storage.local.remove(['all'], () => resolve());
            } else {
                resolve(localStorage.removeItem('all'));
            }
        });
    }

    reset$(): Observable<any> {
        return from(this.reset());
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
