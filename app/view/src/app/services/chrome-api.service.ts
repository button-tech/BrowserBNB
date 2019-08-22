/// <reference types="chrome"/>
import { Injectable, Injector, NgZone } from '@angular/core';
import { environment } from "../../environments/environment";
import { fromEvent, Observable, of, Subject, timer } from "rxjs";
import Port = chrome.runtime.Port;
import { distinctUntilChanged, filter, map, shareReplay, switchMap, take, tap } from "rxjs/operators";

// TODO: move to shared resource and implement watch
type FromPage2BackgroundMsg = {
    type: 'startExtensionSession' | 'dropExtensionSession' | 'keepAlive' | 'restoreExtensionSessionRequest'
    password?: string;
    timeout?: number;
}

type FromContent2BackgroundMsg = {
    type: 'initWalletConnectSession'
    wcDeepLink: string
}

type FromBackgroundToPageMsg = {
    type: 'restoreSessionResponse'
    isExpired: boolean;
    password: string;
}

interface MessageBase {
    type: string
}

export interface IChromeApiService {
    openNewTab(url: string): void;

    restorePassword(): Observable<string>;

    savePassword(password: string): void;

    dropPassword(): void;

    sendKeepAlive(): void;
}


@Injectable()
export class ChromeApiMockService implements IChromeApiService {

    msgFromBackground$: Subject<FromBackgroundToPageMsg> = new Subject();

    constructor() {
        // fromEvent(window, 'FROM_BG');
        window.addEventListener('message', (evt: any) => {
            if (!evt.data || !(evt.data.type === "TO_PAGE")) {
                return;
            }
            const msg = evt.data.msg as any as FromBackgroundToPageMsg;
            console.log(msg);
            this.msgFromBackground$.next(msg);
        })
    }

    openNewTab(url: string) {
        window.open(url, '_blank');
    }

    restorePassword(): Observable<string> {

        const msg: FromPage2BackgroundMsg = {
            type: 'restoreExtensionSessionRequest'
        };

        setTimeout(() => {
            console.log('111');
            window.postMessage({type: "TO_BG", msg}, "*");
        }, 1000);

        return this.msgFromBackground$.pipe(
          tap((x) => {
              console.log('msgFromBackground$=', x);
          }),
          take(1),
          map((response: FromBackgroundToPageMsg) => {
              console.log('response.password =', response.password);
              return (response && response.password) || '';
          }),
          shareReplay(1)
        );
    }

    savePassword(password: string): void {
        console.log('savePassword=', password);

        const msg: FromPage2BackgroundMsg = {
            type: 'startExtensionSession',
            password,
            timeout: 5000 // 30 seconds keep alive
        };

        window.postMessage({type: "TO_BG", msg}, "*");
    }

    dropPassword(): void {
        const msg: FromPage2BackgroundMsg = {
            type: 'dropExtensionSession',
            password: '',
            timeout: 0
        };

        window.postMessage({type: "TO_BG", msg}, "*");
    }

    sendKeepAlive() {
        const msg: FromPage2BackgroundMsg = {
            type: 'keepAlive'
        };
        window.postMessage({type: "TO_BG", msg}, "*");
    }
}

@Injectable()
export class ChromeApiRealService implements IChromeApiService {

    msg: FromBackgroundToPageMsg;
    port: Port;
    msgFromBackground$: Observable<string>;
    readonly sessionTimeout: number = 10000; // 10s

    constructor() {
        this.port = chrome.runtime.connect();

        this.msgFromBackground$ = timer(0, 100).pipe(
          map(() => this.msg),
          filter((msg) => !!msg),
          map((msg: FromBackgroundToPageMsg) => {
              return msg.password;
          }),
          distinctUntilChanged(),
          // filter((msg: FromBackgroundToPageMsg) => {
          //     const x = msg && msg.password !== this.password;
          //     if (x) {
          //         this.password = msg.password;
          //     }
          //     return x;
          // }),
        );

        this.port.onMessage.addListener((msg: FromBackgroundToPageMsg) => {
            console.log('next=', msg);
            // this.msgFromBackground$.next(msg);
            // this.password = msg.password;
            this.msg = msg;

            console.log('this.msg=', this.msg);
        });
    }


    openNewTab(url: string): void {
        chrome.tabs.create({url: url});
    }

    restorePassword(): Observable<string> {
        const msg: FromPage2BackgroundMsg = {
            type: 'restoreExtensionSessionRequest'
        };

        this.port.postMessage(msg);
        return this.msgFromBackground$.pipe(
          // tap((x) => {
          //     console.log('msgFromBackground$=', x);
          // }),
          take(1),
          map((password: string) => {
              console.log(`!!!!!${password}!!!!!!`);
              return (password) || '';
          })
        );
    }

    savePassword(password: string): void {
        console.log('savePassword=', password);
        const msg: FromPage2BackgroundMsg = {
            type: 'startExtensionSession',
            password,
            timeout: this.sessionTimeout
        };

        this.port.postMessage(msg);
    }

    dropPassword() {
        const msg: FromPage2BackgroundMsg = {
            type: 'dropExtensionSession'
        };

        this.port.postMessage(msg);
    }

    sendKeepAlive() {
        const msg: FromPage2BackgroundMsg = {
            type: 'keepAlive'
        };

        this.port.postMessage(msg);
    }
}

// Should be placed here to avoid TS warnings, should be exported for aot build
// export function getImplementation() {
//     console.log('environment.production:', ChromeApiMockService);
//     return environment.production
//         ? ChromeApiRealService
//         : ChromeApiMockService;
// }

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
