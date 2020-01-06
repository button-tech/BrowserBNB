import {merge, Observable, Subject} from "rxjs";
import WalletConnect from "@walletconnect/browser/lib";
import {map} from "rxjs/operators";

// TODO: Think about: implement decorator out of this function
function fromWalletConnectEvent(eventName: string, wc: WalletConnect): Subject<unknown> {
    const subject$ = new Subject<any>();
    wc.on(eventName, (error, payload) => {
        if (eventName === 'call_request' || eventName === 'connect' || eventName === 'disconnect') {
            // debugger
        }

        console.log(error, payload);
        if (error) {
            subject$.error(error);
        }

        console.log('next:', eventName, payload);
        subject$.next(payload);
    });
    return subject$;
}

export class ReactiveWc {

    private _sessionRequest$: Subject<any>;
    sessionRequest$: Observable<any>;

    private _callRequest$ = new Subject<any>();
    callRequest$: Observable<any> = this._callRequest$.asObservable();

    private _connect$ = new Subject<any>();
    connect$: Observable<any> = this._connect$.asObservable();

    private _disconnect$ = new Subject<any>();
    disconnect$: Observable<any> = this._disconnect$.asObservable();

    isConnected$: Observable<boolean>;

    constructor(public instance: WalletConnect) {

        this._sessionRequest$ = fromWalletConnectEvent("session_request", this.instance);
        this.sessionRequest$ = this._sessionRequest$.asObservable();

        this._callRequest$ = fromWalletConnectEvent("call_request", this.instance);
        this.callRequest$ = this._callRequest$.asObservable();

        this._connect$ = fromWalletConnectEvent("connect", this.instance);
        this.connect$ = this._connect$.asObservable();

        this._disconnect$ = fromWalletConnectEvent("disconnect", this.instance);
        this.disconnect$ = this._disconnect$.asObservable();

        this.isConnected$ = merge(
            this.connect$.pipe(map(() => true)),
            this.disconnect$.pipe(map(() => false))
        )
    }
}

//
// TODO: think on implementing this - restoring wallet connect from local storage
//
// initWallet() {
//     const local = localStorage ? localStorage.getItem("walletconnect") : null;
//
//     if (local) {
//         let session;
//
//         try {
//             session = JSON.parse(local);
//         } catch (error) {
//             throw error;
//         }
//
//         const walletConnector = new WalletConnect({session});
//
//         walletConnector.killSession();
//         (walletConnector as any)._removeStorageSession();
//     }
// }
