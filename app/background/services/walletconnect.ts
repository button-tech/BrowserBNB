/*
* MIT License
*
* Copyright (c) 2019 BUTTON Wallet
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
    *
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import { IConnector } from '@walletconnect/types'
import { signTransaction, getAddressFromPrivateKey } from "./binancecrypto";
import { ISignedTransaction } from '../models';
import WalletConnect from "@walletconnect/browser/lib";

export class WalletConnectController {
    private instance: WalletConnect;
    private bnbAddress: string;

    constructor(private privateKey: string, private connectionUrl: string) {
        // create instance of Wallet Connect using URL
        this.bnbAddress = getAddressFromPrivateKey(privateKey, 'bnb');
        console.log(this.bnbAddress);
        this.initInstance(connectionUrl);
    }

    private async initInstance(connectionUrl: string) {
        this.instance = new WalletConnect({
            uri: connectionUrl
        });

        if (!this.instance.connected) {
            console.log('a1');
            await this.instance.createSession();
            console.log('a2');
        } else {
            this.instance.killSession();
            (this.instance as any)._removeStorageSession();
        }
        this.subscribeToEvents();
    }

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
            this.disconnect()
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

            const walletConnector = new WalletConnect({ session });

            walletConnector.killSession();
            (walletConnector as any)._removeStorageSession();
        }
    }


    private signTransaction(rawTransaction: any): ISignedTransaction {
        return signTransaction(this.privateKey, rawTransaction);
    }

}
