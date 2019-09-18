/*
* MIT License
*
* Copyright (c) 2019 BUTTON Wallet
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import {merge, Observable, Subject} from "rxjs";
import WalletConnect from "@walletconnect/browser/lib";
import {getAddressFromPrivateKey, signTransaction} from "./binancecrypto";
import {ISignedTransaction} from "./types";
import {map} from "rxjs/operators";


function fromWcEvent(eventName: string, wc: WalletConnect): Subject<any> {

    const subject$ = new Subject<any>();

    wc.on(eventName, (error, payload) => {
        if (eventName === 'call_request' || eventName === 'connect' || eventName === 'disconnect') {
            debugger
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

        this._sessionRequest$ = fromWcEvent("session_request", this.instance);
        this.sessionRequest$ = this._sessionRequest$.asObservable();

        this._callRequest$ = fromWcEvent("call_request", this.instance);
        this.callRequest$ = this._callRequest$.asObservable();

        this._connect$ = fromWcEvent("connect", this.instance);
        this.connect$ = this._connect$.asObservable();

        this._disconnect$ = fromWcEvent("disconnect", this.instance);
        this.disconnect$ = this._disconnect$.asObservable();


        this.isConnected$ = merge(
          this.connect$.pipe(map(() => true)),
          this.disconnect$.pipe(map(() => false))
        )
    }
}

// export function approveSession(wcSessionEndpoint: string) {
//     // const wcSession = 'wc:b1548cf8-49ab-4289-abf5-1cc4cd108a6d@1?bridge=https%3A%2F%2Fwallet-bridge.binance.org&key=8057158df84cca0773fbdcdb01a6bee6739cf340a00f82834ab13d83fa0c54ff';
//
//     const privateKey = '90335b9d2153ad1a9799a3ccc070bd64b4164e9642ee1dd48053c33f9a3a05e9';
//     const wc = new WalletConnectController(privateKey, wcSessionEndpoint);
//
//     wc.approveSession();
//     console.log(wc);
// }

export class WalletConnectController {
    private instance: WalletConnect;
    private bnbAddress: string;

    constructor(private privateKey: string, connectionUrl: string) {
        // create instance of Wallet Connect using URL
        this.bnbAddress = getAddressFromPrivateKey(this.privateKey, 'bnb');
        console.log(this.bnbAddress);
        this.instance = new WalletConnect({
            uri: connectionUrl
        });

        this.instance.createSession().then(() => {
            this.subscribeToEvents();
        })
    }

    // private async initInstance(connectionUrl: string) {
    //     this.instance = new WalletConnect({
    //         uri: connectionUrl
    //     });
    //
    //     if (!this.instance.connected) {
    //         console.log('a1');
    //         await this.instance.createSession();
    //         console.log('a2');
    //     } else {
    //         this.instance.killSession();
    //         (this.instance as any)._removeStorageSession();
    //     }
    //     this.subscribeToEvents();
    // }

    // subscribeToEvents() {
    //     const { walletConnector } = this;
    //     const tabId = this.tabId;
    //
    //     if (walletConnector) {
    //         walletConnector.on("session_request", (error, payload) => {
    //             console.log('walletConnector.on("session_request")');
    //
    //             if (error) {
    //                 throw error;
    //             }
    //
    //             const { peerMeta } = payload.params[0];
    //             this.state.peerMeta = peerMeta;
    //             this.state.isLoadingWalletConnect = false;
    //
    //             // auto approve
    //             this.approveSession();
    //         });
    //
    //         walletConnector.on("session_update", (error, payload) => {
    //             console.log('walletConnector.on("session_update")'); // tslint:disable-line
    //
    //             if (error) {
    //                 throw error;
    //             }
    //         });
    //
    //         walletConnector.on("call_request", (error, payload) => {
    //             console.log('walletConnector.on("call_request")', payload); // tslint:disable-line
    //
    //             if (error) {
    //                 throw error;
    //             }
    //             if (payload.method === "bnb_sign") {
    //                 this.state.displayRequest = payload;
    //
    //                 chrome.tabs.sendMessage(
    //                   tabId,
    //                   {
    //                       showConfirmation: true,
    //                   },
    //                   result => {
    //                       console.log("result ->>>>>", result);
    //
    //                       if (result) {
    //                           this.approveRequest(payload);
    //                       } else {
    //                           this.rejectRequest(payload);
    //                       }
    //
    //                       chrome.tabs.sendMessage(tabId, {
    //                           hideConfirmation: true,
    //                       });
    //                   }
    //                 );
    //             }
    //         });
    //
    //         walletConnector.on("connect", (error, payload) => {
    //             console.log('walletConnector.on("connect")'); // tslint:disable-line
    //
    //             if (error) {
    //                 throw error;
    //             }
    //
    //             this.state.connected = true;
    //         });
    //
    //         walletConnector.on("disconnect", (error, payload) => {
    //             console.log('walletConnector.on("disconnect")', walletConnector); // tslint:disable-line
    //
    //             if (error) {
    //                 throw error;
    //             }
    //             this.state.connected = false;
    //             this.state.displayRequest = null;
    //             this.state.peerMeta = null;
    //             this.initWallet();
    //             this.startScanQrCode = false;
    //         });
    //
    //         if (walletConnector.connected) {
    //             const { chainId, accounts } = walletConnector;
    //             const address = accounts[0];
    //
    //             this.state.connected = true;
    //             this.state.address = address;
    //             this.state.chainId = chainId;
    //         } else {
    //             this.state.connected = false;
    //             this.state.displayRequest = null;
    //             this.state.peerMeta = null;
    //         }
    //
    //         this.walletConnector = walletConnector;
    //     }
    // }

    public subscribeToEvents(): void {
        const walletConnector = this.instance;

        if (!walletConnector)
            return;

        walletConnector.on("session_request", (error, payload) => {
            console.log("session_request", error, payload);
            if (error) {
                throw error;
            }
            console.log("session_request");
            this.approveSession();
        });

        walletConnector.on("call_request", (error, payload) => {
            console.log("call_request", error, payload);
            if (error) {
                throw error;
            }

            if (payload.method === "bnb_sign") {
                this.approveRequestCall(payload)
            }
        });

        walletConnector.on("connect", (error, payload) => {
            console.log("connect", error, payload);
            if (error) {
                throw error;
            }
            // this.disconnect()
        });

        walletConnector.on("disconnect", (error, payload) => {
            console.log("disconnect", error, payload);
            console.log("disconnect");
            if (error) {
                throw error;
            }
            // this.disconnect()
        });

    }

    public async approveSession() {

        const walletConnector = this.instance;
        if (!walletConnector) {
            return;
        }

        //debugger
        walletConnector.approveSession({
            chainId: 1,
            accounts: [this.bnbAddress],
        });
        console.log("approveSession", this.bnbAddress);
    }

    public rejectSession() {
        const walletConnector = this.instance;
        if (walletConnector) {
            walletConnector.rejectSession();
        }
    }

    public rejectRequestCall(): boolean {
        return true;
    }

    public async approveRequestCall(payload: any) {
        const walletConnector = this.instance;

        if (payload.method === "bnb_sign") {
            const [rawTx] = payload.params;
            const txSign = await this.signTransaction(rawTx);
            await walletConnector.approveRequest({
                id: payload.id,
                result: JSON.stringify(txSign),
            });
        }
    }

    public disconnect() {
        const walletConnector = this.instance;
        if (walletConnector) {
            walletConnector.killSession();
        }
        this.initWallet();
    }

    /**
     * Init walletConnect from localStorage.
     *
     */
    initWallet() {
        const local = localStorage ? localStorage.getItem("walletconnect") : null;

        if (local) {
            let session;

            try {
                session = JSON.parse(local);
            } catch (error) {
                throw error;
            }

            const walletConnector = new WalletConnect({session});

            walletConnector.killSession();
            (walletConnector as any)._removeStorageSession();
        }
    }


    private signTransaction(rawTransaction: any): ISignedTransaction {
        return signTransaction(this.privateKey, rawTransaction);
    }

}
