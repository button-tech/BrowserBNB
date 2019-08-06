/// <reference types="chrome"/>
import { Injectable, Injector, NgZone } from '@angular/core';
import { environment } from "../../environments/environment";
import { Observable, of, Subject, timer } from "rxjs";
import Port = chrome.runtime.Port;
import { filter, map, switchMap, take, tap } from "rxjs/operators";


interface MessageFromPage {
    type: 'startSession' | 'dropSession' | 'keepAlive' | 'restoreSession';
    password?: string;
    timeout?: number;
}

interface MessageFromBackground {
    type: 'restoreSession';
    password?: string;
}


@Injectable({
    providedIn: 'root',
    useClass: getImplementation(),
    deps: []
})
export abstract class ChromeApiService {
    abstract openNewTab(url: string): void;

    abstract restorePassword(): Observable<string>;

    abstract savePassword(password: string): void;

    abstract dropPassword(): void;
}


@Injectable()
export class ChromeApiMockService extends ChromeApiService {

    openNewTab(url: string) {
        window.open(url, '_blank');
    }

    restorePassword(): Observable<string> {
        return of('');
    }

    savePassword(password: string): void {

    }

    dropPassword(): void {

    }
}

@Injectable()
export class ChromeApiRealService extends ChromeApiService {

    password = '';
    msg: MessageFromBackground;
    // password2: string;

    port: Port;
    msgFromBackground$: Observable<MessageFromBackground>; // = new Subject<MessageFromBackground>();

    constructor(private ngZone: NgZone) {
        super();
        this.port = chrome.runtime.connect();

        // const waitForRestore = (msg: MessageFromBackground) => {
        //     if (msg.type === 'restoreSession') {
        //         if (msg.password) {
        //             this.restoredPassword$.next(msg.password);
        //         } else {
        //             this.restoredPassword$.complete();
        //         }
        //     }
        // };

        this.msgFromBackground$ = timer(0, 250).pipe(
            // tap((msg: MessageFromBackground) => {
            //     console.log('tap: ', msg);
            // }),

            map(() => {
                // console.log('timer=', this.msg);
                return this.msg;
            }),
            filter((msg: MessageFromBackground) => {
                // console.log('msg --->', msg);
                // console.log('1-', msg, '2-', this.msg);
                const x = msg && msg.password !== this.password;

                if (x) {
                    this.password = msg.password;
                }
                // console.log('!pass!', msg);
                // return x;
                return x;
            }),
            map((msg: MessageFromBackground) => {
                console.log('restoreSession --> ', msg.password);
                return {
                    type: 'restoreSession',
                    password: msg.password
                } as MessageFromBackground;
            })
        );

        // this.msgFromBackground$
        //     .subscribe((msg: MessageFromBackground) => {});

        // this.msgFromBackground$.asObservable().pipe().subscribe();


        // this.ngZone.runOutsideAngular(() => {
        this.port.onMessage.addListener((msg: MessageFromBackground) => {
            console.log('next=', msg);
            // this.msgFromBackground$.next(msg);
            // this.password = msg.password;
            this.msg = msg;
            console.log('this.msg=', this.msg);
        });
        // });
    }


    openNewTab(url: string): void {
        chrome.tabs.create({url: url});
    }

    restorePassword(): Observable<string> {
        const msg: MessageFromPage = {
            type: 'restoreSession'
        };

        this.port.postMessage(msg);
        return this.msgFromBackground$.pipe(
            tap((x) => {
                console.log('msgFromBackground$=', x);
            }),
            take(1),
            map((reponse: MessageFromBackground) => {
                return (reponse && reponse.password) || '';
            })
        );
    }

    savePassword(password: string): void {
        console.log('savePassword=', password);
        const msg: MessageFromPage = {
            type: 'startSession',
            password,
            timeout: 30000 // 10 seconds keep alive
        };

        this.port.postMessage(msg);
        // TODO: start keep alive
    }

    dropPassword() {
        const msg: MessageFromPage = {
            type: 'dropSession'
        };
        this.port.postMessage(msg);

        // TODO: stop keep alive
    }
}

// Should be placed here to avoid TS warnings, should be exported for aot build
export function getImplementation() {
    return environment.production
        ? ChromeApiRealService
        : ChromeApiMockService;
}

// @Injectable({
//     providedIn: 'root'
// })
// export class ChromeApiService implements IChromeApiService {
//
//     implementation: IChromeApiService;
//
//     constructor(private injector: Injector) {
//
//         if (environment.production) { // some condition
//             this.implementation = injector.get<MyService>(MyService);
//         }
//     }
//
//     openNewTab(url: string): void {
//         this.implementation.openNewTab(url);
//     }
//
//     restorePassword(): Observable<string> {
//         return of('');
//     }
//
//     savePassword() {
//
//     }
//
//     dropPassword() {
//
//     }
// }
