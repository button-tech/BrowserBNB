// import * as passworder from 'browser-passworder';
import { from, Observable, of, Subject, timer } from "rxjs";
// import { environment } from "../view/src/environments/environment";
// import { IStorageData } from "../view/src/app/services/storage.service";
import { map, switchMap, switchMapTo, tap, timeout } from "rxjs/operators";
import Port = chrome.runtime.Port;

// const STORAGE_KEY = 'all';
//
// function getFromStorageRaw(): Promise<string> {
//     return new Promise<any>((resolve, reject) => {
//         if (environment.production) {
//             chrome.storage.local.get(STORAGE_KEY, (result) => resolve(result[STORAGE_KEY]));
//         } else {
//             const result = localStorage.getItem(STORAGE_KEY);
//             resolve(result);
//         }
//     });
// }
//
// function getFromStorage(password: string): Observable<IStorageData> {
//     return from(this.getFromStorageRaw()).pipe(
//         switchMap((encrypted: any) => {
//             return from(passworder.decrypt(password, encrypted));
//         }),
//         map((dectypted: any) => {
//             return dectypted as IStorageData;
//         })
//     );
// }

interface MessageFromPage {
    type: 'startSession' | 'dropSession' | 'keepAlive' | 'restoreSession';
    password?: string;
    timeout?: number;
}

interface MessageFromBackground {
    type: 'restoreSession';
    password?: string;
}


// msg.password
// const decryptedDate$ = passworder.decrypt(password, data);
// of(decryptedDate$).pipe(
//     tap(() => {
//         password = msg.password
//     }),
//     switchMap(tm$),
//     // switchMap((decoded) => {
//     //     password = msg.password;
//     // }),
// ).subscribe(
//     () => {
//     },
//     () => {
//         password = '';
//     }
// );
// try to decode and save password

class MessageProcessor {
    private password = '';
    private keepAlive$ = new Subject<boolean>();

    processMsg(msg: MessageFromPage, port: Port) {
        console.log('1');
        if (msg.type === 'startSession') {

            this.password = msg.password;
            console.log('this.password=', this.password);
            // const timeout$ = timeout(msg.timeout);

            this.keepAlive$.pipe(
                tap(() => {
                    console.log('keep alive');
                }),
                switchMap((x: any) => {
                    console.log('keep alive, do switch map, and attach timeout');
                    return timeout(msg.timeout);
                }),
            ).subscribe(
                () => {
                    // Normal keep alive comes here
                    console.log('keep alive, do nothing');
                },
                () => {
                    console.log('log out on timeout');
                    this.password = '';
                });

            return;
        }

        console.log('2');
        if (msg.type === 'dropSession') {
            this.password = '';
            return;
        }


        console.log('3');
        if (msg.type === 'keepAlive') {
            this.keepAlive$.next(true);
            return;
        }

        console.log('4');
        if (msg.type === 'restoreSession') {

            console.log('5');
            const response: MessageFromBackground = {
                password: this.password,
                type: 'restoreSession'
            };

            console.log('send password', this.password);
            port.postMessage(response);
            return;
        }
    }
}


function f() {

    chrome.runtime.onConnect.addListener((port) => {
        console.log('onConnect');

        const processor = new MessageProcessor();

        port.onMessage.addListener((msg: MessageFromPage) => {

            console.log('msg1', msg);
            if (!msg || !msg.type) {
                return;
            }
            console.log('msg2', msg);
            processor.processMsg(msg, port)
        });
    });


    // timer(0, 2000).subscribe(() => {
    //     console.log('1123');
    // });

    // const encrypted = await passworder.encrypt(password, data);
    // console.log(encrypted);
    //
    // let a = "https://dex.binance.org/api/v1/account/bnb1hgm0p7khfk85zpz5v0j8wnej3a90w709vhkdfu";
    // const x = fetch(a).then((x) => {
    //     x.json().then((obj) => {
    //         debugger
    //     })
    // })
}

console.log('f()');
f();
