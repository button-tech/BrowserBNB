/// <reference types="chrome"/>
import {Injectable} from '@angular/core';
import {Container} from "../models/container.model";
import {MemoryService} from "./memory.service";

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    val: Container;

    constructor(private memory: MemoryService) {
        this.val = {
            accountName: "First",
            privateKeystore: ""
        };
    }

    set() {

        const wrappedKeystore = JSON.stringify(this.memory.getCurrentKeystore());

        this.val = {
            accountName: "First",
            privateKeystore: wrappedKeystore
        };

        const wrappedVal = JSON.stringify(this.val);

        chrome.storage.local.set({all: wrappedVal},
            () => {
                console.log('Value is set to ' + wrappedVal);
            }
        );
    }

    async get() {
        await chrome.storage.local.get(["all"],
            (result) => {
                console.log('36 log ' + result.all);
                this.kostyl(result.all)
            }
        );
    }

    // todo: refactor!
    kostyl(val2: any) {
        console.log("45");
        let res;
        try {
            res = JSON.parse(val2);
        }
        catch (e) {
            console.log(e)
        }
        this.val = res;
        if (res) {
            this.memory.setCurrentKeystore(this.val.privateKeystore);
        }
    }

    reset() {
        chrome.storage.local.remove(["all"],
            () => {
            }
        );
    }
}
