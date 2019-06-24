import {Injectable} from '@angular/core';
import {chrome} from 'chrome';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor() {
    }

    // setKeystore(key: string, rawKeystore: string) {
    //     chrome.storage.local.set({key, rawKeystore});
    // }
    //
    // async getKeystore(key: string): Observable<string> {
    //     await chrome.storage.local.get(key, (x) => {
    //         return x
    //     })
    // }
}
