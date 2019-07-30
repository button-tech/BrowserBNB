import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ChromeApiService {

    constructor() {
    }

    openNewTab(url: string) {
        if (environment.production) {
            chrome.tabs.create({url: url});
        } else {
            window.open(url, '_blank');
        }

    }
}
