/// <reference types="chrome"/>
import {Injectable} from '@angular/core';
import {MemoryService} from './memory.service';
import {BehaviorSubject, from, fromEvent, Observable, Subject} from 'rxjs';
import {ɵBrowserAnimationBuilder} from '@angular/platform-browser/animations';

export interface IWrappedKeystore {
    accountName: string;
    privateKeystore: any; // TODO: sepcify interface from typings
}

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    // TODO: remove
    val: IWrappedKeystore = {accountName: 'First', privateKeystore: ''};

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

    async get(): Promise<any> {
        const promise = new Promise((resolve, reject) => {
            chrome.storage.local.get(['all'], (result) => {

                try {
                    const value = JSON.parse(result.all);
                    resolve(value);
                } catch {
                    // DO nothing
                }

                if (!result.all) {
                    resolve(result.all); // value from storage as it is
                }
            });
        });

        return promise;
    }

    // Rx wrapper on promise
    get$(value: any): Observable<string> {
        return from(this.get());
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
}
