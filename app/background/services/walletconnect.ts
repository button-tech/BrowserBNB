/*
* MIT License
*
* Copyright (c) 2019 BUTTON Wallet
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
    *
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import {IConnector} from '@walletconnect/types'
import {WalletConnect} from '@walletconnect/browser'
import {signTransaction, getAddressFromPrivateKey} from "./binancecrypto";
import {ISignedTransaction} from '../models';

class WalletConnectController {
    private instance: IConnector;
    private bnbAddress: string;

    constructor(private privateKey: string, private connectionUrl: string) {
        // create instance of Wallet Connect using URL
        this.bnbAddress = getAddressFromPrivateKey(privateKey, 'bnb');
        this.initInstance(connectionUrl);
    }

    private async initInstance(connectionUrl: string) {
        this.instance = new WalletConnect({connectionUrl});
        if (!this.instance.connected) {
            await this.instance.createSession();
        } else {
            this.instance.killSession();
            this.instance._removeStorageSession();
        }
        this.subscribeToEvents();
    }

    public subscribeToEvents(): void {
        const walletConnector = this.instance;

        if (walletConnector) {
            walletConnector.on("session_request", (error, payload) => {
                if (error) {
                    throw error;
                }
                this.approveSession();
            });

            walletConnector.on("call_request", (error, payload) => {
                if (error) {
                    throw error;
                }

                if (payload.method === "bnb_sign") {
                    this.approveRequestCall(payload)
                }
            });

            walletConnector.on("disconnect", (error, payload) => {
                if (error) {
                    throw error;
                }
                this.disconnect()
            });
        }
    }

    public async approveSession() {
        const walletConnector = this.instance;
        if (walletConnector) {
            walletConnector.approveSession({
                chainId: 1,
                accounts: [this.bnbAddress],
            });
        }
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
    }

    private signTransaction(rawTransaction: any): ISignedTransaction {
        return signTransaction(this.privateKey, rawTransaction);
    }

}