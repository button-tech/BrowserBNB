/// <reference types="chrome"/>
import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";


@Injectable({
    providedIn: 'root'
})
export class ChromeApiService {
    port: any;

    constructor() {

    }

    openNewTab(url: string) {
        if (environment.production) {
            chrome.tabs.create({url: url});
        } else {
            window.open(url, '_blank');
        }
    }

    connectToBackground() {
        // this.port = chrome.runtime.connect({name:"mycontentscript"}).port.onMessage.addListener((message,sender) => {
        //     if(message.greeting === "hello"){
        //         alert(message.greeting);
        //     }
        // });
        this.port = chrome.runtime.connect({name: "mycontentscript"});
        this.port.onMessage.addListener((message, sender) => {
            if (message.greeting === "hello") {
                alert(message.greeting);
            }
        });

    }
}
