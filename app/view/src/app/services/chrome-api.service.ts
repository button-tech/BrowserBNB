/// <reference types="chrome"/>
import { Injectable, Injector } from '@angular/core';
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { ChromeApiMockService } from "./chrome-api-mock.service";
import { ChromeApiRealService } from "./chrome-api-real.service";

export interface IChromeApiService {
    openNewTab(url: string): void;

    restorePassword(): Observable<string>;

    savePassword(password: string): void;

    dropPassword(): void;

    sendKeepAlive(): void;
}

@Injectable()
export class ChromeApiService implements IChromeApiService {

    implementation: IChromeApiService;

    constructor(private injector: Injector) {
        if (environment.production) { // some condition
            this.implementation = injector.get<ChromeApiRealService>(ChromeApiRealService);
        } else {
            this.implementation = injector.get<ChromeApiMockService>(ChromeApiMockService);
        }
    }


    openNewTab(url: string): void {
        this.implementation.openNewTab(url);
    }

    restorePassword(): Observable<string> {
        return this.implementation.restorePassword();
    }

    savePassword(password: string): void {
        this.implementation.savePassword(password);
    }

    dropPassword() {
        return this.implementation.dropPassword();
    }

    sendKeepAlive() {
        return this.implementation.sendKeepAlive();
    }
}

// Should be placed here to avoid TS warnings, should be exported for aot build
// export function getImplementation() {
//     console.log('environment.production:', ChromeApiMockService);
//     return environment.production
//         ? ChromeApiRealService
//         : ChromeApiMockService;
// }

