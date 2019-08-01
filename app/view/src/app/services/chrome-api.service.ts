/// <reference types="chrome"/>
import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {BehaviorSubject, timer} from "rxjs";
import {map} from "rxjs/operators";


@Injectable({
    providedIn: 'root'
})
export class ChromeApiService {
    port: any;
    balance = new BehaviorSubject('');
    constructor() {
        this.port = chrome.runtime.connect();
    }

    openNewTab(url: string) {
        if (environment.production) {
            chrome.tabs.create({url: url});
        } else {
            window.open(url, '_blank');
        }
    }

    connectToBackground() {
        this.port.onMessage.addListener((message, sender) => {});
        this.updateBalance();

    }

    updateBalance() {
        timer(0, 1000).pipe(
            map((x) => {
                chrome.runtime.sendMessage(
                    "balance",
                    (response) => {
                        this.balance.next(response);
                        console.log(response);
                    }
                );
            })
        ).subscribe();
    }
}
