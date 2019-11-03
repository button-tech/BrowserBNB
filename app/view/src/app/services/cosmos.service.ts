import {Injectable} from '@angular/core';
import * as Cosmos from '../../assets/cosmos/cosmosSDK.js';
import {Observable, of} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";

export interface IBalance {
    free: string;
    frozen: string;
    locked: string;
    symbol: string;
}

export interface IGetBalanceResponse {
    account_number: number;
    address: string;
    balances: IBalance[];
    public_key: number[];
    sequence: number;
}

export interface IHistoryTx {
    txHash: string;
    blockHeight: number;
    txType: string;
    timeStamp: Date;
    fromAddr: string;
    toAddr: string;
    value: string;
    txAsset: string;
    txFee: string;
    txAge: number;
    orderId: string;
    code: number;
    data: string;
    confirmBlocks: number;
    memo: string;
}

export interface IGetHistoryResponse {
    tx: IHistoryTx[];
    total: number;
}


@Injectable({
    providedIn: 'root'
})
export class CosmosService {

    constructor( private http: HttpClient ) {
    }

    async sendTransaction() {
        const chainId = "cosmoshub-2";
        const cosmos = Cosmos.returnInstance('https://lcd-do-not-abuse.cosmostation.io', 'cosmoshub-2');
        const mnemonic = '';
        cosmos.setBech32MainPrefix("cosmos");
        cosmos.setPath("m/44'/118'/0'/0/0");

        const ecpairPriv = cosmos.getECPairPriv(mnemonic);

        const stdSignMsg = cosmos.NewStdMsg({
            type: "cosmos-sdk/MsgSend",
            from_address: 'cosmos1phzk96xke3wf9esuys7hkllpltx57sjrhdqymz',
            to_address: "cosmos1et7a8svmxfkz23mn280k34q6upj36d7lggflpa",
            amountDenom: "uatom",
            amount: 100000,
            feeDenom: "uatom",
            fee: 5000,
            gas: 200000,
            memo: "",
            account_number: 22418,
            sequence: 1
        });
        const signedTx = cosmos.sign(stdSignMsg, ecpairPriv);
        cosmos.broadcast(signedTx).then(response => console.log(response));
    }

    getBalance$( address: string, endpoint: string ): Observable<IBalance[]> {
        // return this.http.get(`${endpoint}/auth/account/${address}`).pipe(
        console.log('tetetettette');
        return this.http.get(`${endpoint}${address}`).pipe(
            map(( response ) => {
                // @ts-ignore
                const sum = (Number(response.value.coins[0].amount) / 1000000).toString();
                const bal = {
                    free: sum,
                    frozen: '0',
                    locked: '0',
                    symbol: 'uatom'
                };

                return [bal];
            }),
            catchError(( error: HttpErrorResponse ) => {
                // TODO: properly handle binance 404 response
                // const errResp:  AccountInfo;
                const bal = {
                    free: '0',
                    frozen: '0',
                    locked: '0',
                    symbol: 'uatom'
                };

                return of ([bal]);
            })
        );
    }
}


