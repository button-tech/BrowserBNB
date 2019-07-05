/// <reference types="chrome"/>
import {Injectable} from '@angular/core';
import {MemoryService} from './memory.service';
import {BehaviorSubject, from, fromEvent, Observable, Subject} from 'rxjs';
import {ɵBrowserAnimationBuilder} from '@angular/platform-browser/animations';

export interface IWrappedAccounts {
    Account: IAccount[];
}

interface IAccount {
    encryptedSeed: string;
    encryptedKeystore: string;
    accountName: string;
}

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    // TODO: remove
    // val: IWrappedAccounts = {accountName: 'First', privateKeystore: ''};

    // TODO: test this
    // private storageSubject: Subject<any> = new Subject();
    // storage$: Observable<any> = this.storageSubject;

    constructor() {
        // TODO: test this
        // chrome.storage.onChanged.addListener(function (changes, namespace) {
        //     // debugger
        //     const storageChange = changes['all'];
        //     if (storageChange) {
        //         this.storageSubject.next(storageChange.newValue);
        //     }
        //
        //     // if(changes[key])
        //     // for (var key in changes) {
        //     //     var storageChange = changes[key];
        //     //     console.log('Storage key "%s" in namespace "%s" changed. ' +
        //     //         'Old value was "%s", new value is "%s".',
        //     //         key,
        //     //         namespace,
        //     //         storageChange.oldValue,
        //     //         storageChange.newValue);
        //     // }
        // });
    }


    // the actual async value that will be returned is 'saved'
    async set(value: any): Promise<string> {
        return new Promise((resolve, reject) => {
            const jsonText = JSON.stringify(value);
            chrome.storage.local.set({all: jsonText}, () => resolve('saved'));
        });
    }

    // Rx wrapper on promise
    set$(value: any): Observable<string> {
        const promise = this.set(value);
        return from(promise);
    }

    async get(value: string): Promise<any> {
        const promise = new Promise((resolve, reject) => {
            chrome.storage.local.get(['all'], (result) => {
                let finalValue;
                try {
                    finalValue = JSON.parse(result.all);
                    console.log(`72  ${finalValue}`);
                } catch {
                    // DO nothing
                }

                if (!finalValue) {
                    console.log(`78  ${finalValue}`);
                    resolve(finalValue); // value from storage as it is
                }
                else if (value === 'privateKeystore') {
                    console.log(`83  ${finalValue.privateKeystore}`);
                    resolve(finalValue.privateKeystore)
                }
                else if (value === 'accountName') {
                    console.log(`88  ${finalValue.accountName}`);
                    resolve(finalValue.accountName)
                }
            });
        });

        return promise;
    }

    // Rx wrapper on promise
    get$(value: string): Observable<string> {
        console.log(`99 ${this.get(value)}`);
        return from(this.get(value));
    }

    async reset() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.remove(['all'], () => {
                resolve();
            });
        });
    }

    // returns observable that fires one undefined valuer I guess, todo check
    reset$(value: any): Observable<any> {
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