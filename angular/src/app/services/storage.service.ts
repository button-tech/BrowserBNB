import {Injectable} from '@angular/core';
// import {chrome} from '@types/chrome';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor() {
    }

    // async setKeystore(key: string, rawKeystore: string) {
    //     chrome.storage.local.set({key, rawKeystore});
    // }

    // async getKeystore(key: string): string {
    //     await chrome.storage.local.get(key, (x) => {
    //        return x;
    //     });
    // }
}
