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

    async sendTransaction(sum: number,
                          addressTo: string,
                          addressFrom: string,
                          mnemonic: string,
                          accountIndex: number,
                          message?: string) {

        this.getAccountSequence$(addressFrom).pipe(
            map((resp) => {

                const cosmos = Cosmos.returnInstance('https://lcd-do-not-abuse.cosmostation.io', 'cosmoshub-2');
                cosmos.setBech32MainPrefix("cosmos");
                cosmos.setPath("m/44'/118'/0'/0/" + accountIndex.toString());    // maybe error
                const ecpairPriv = cosmos.getECPairPriv(mnemonic);

                const stdSignMsg = cosmos.NewStdMsg({
                    type: "cosmos-sdk/MsgSend",
                    from_address: addressFrom,
                    to_address: addressTo,
                    amountDenom: "uatom",
                    amount: sum,
                    feeDenom: "uatom",
                    fee: 5000,
                    gas: 200000,
                    memo: message || '',
                    account_number: resp.accountNumber.toString(),
                    sequence: resp.seq.toString()
                });


                const signedTx = cosmos.sign(stdSignMsg, ecpairPriv);

                cosmos.broadcast(signedTx).then(response => console.log(response));
            })
        ).subscribe();

    }

    async sendTransactionWithPk(sum: number,
                          addressTo: string,
                          addressFrom: string,
                          privateKey: string,
                          message?: string) {

        this.getAccountSequence$(addressFrom).pipe(
            map(( resp ) => {

                const cosmos = Cosmos.returnInstance('https://lcd-do-not-abuse.cosmostation.io', 'cosmoshub-2');
                cosmos.setBech32MainPrefix("cosmos");
                const rawKey = Buffer.from(privateKey, 'hex');

                const stdSignMsg = cosmos.NewStdMsg({
                    type: "cosmos-sdk/MsgSend",
                    from_address: addressFrom,
                    to_address: addressTo,
                    amountDenom: "uatom",
                    amount: sum,
                    feeDenom: "uatom",
                    fee: 5000,
                    gas: 200000,
                    memo: message || '',
                    account_number: resp.accountNumber.toString(),
                    sequence: resp.seq.toString()
                });


                const signedTx = cosmos.sign(stdSignMsg, rawKey);

                cosmos.broadcast(signedTx).then(response => console.log(response));
            })
        ).subscribe();
    }

    getBalance$( address: string, endpoint: string ): Observable<IBalance[]> {
        // return this.http.get(`${endpoint}/auth/account/${address}`).pipe(
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

    getHistory$(address: string, endpoint: string): Observable<IHistoryTx[]> {
        return this.http.get(`http://78.47.86.168:31228/blockatlas/v1/cosmos/${address}`)
            .pipe(
                map((response) => {
                    return reMap(response).tx;
                }),
                catchError((error: HttpErrorResponse) => {
                    // TODO: properly handle binance 404 response
                    return of([]);
                })
            );
    }

    getAccountSequence$(address: string): Observable<any> {
        return this.http.get(`https://lcd-do-not-abuse.cosmostation.io/auth/accounts/${address}`).pipe(
            map(( response ) => {
                 // @ts-ignore
                const x = response.value;
                return {
                    accountNumber:  (Number(x.account_number)),
                    seq:  (Number(x.sequence))
                };
            }),
            catchError(( error: HttpErrorResponse ) => {
                // TODO: properly handle binance 404 response
                // const errResp:  AccountInfo;
                return of ({accountNumber: 0, seq:  0});
            })
        );
    }

    signRawMessage(pk: string, rawMsg: any): any {
        const cosmos = Cosmos.returnInstance('https://lcd-do-not-abuse.cosmostation.io', 'cosmoshub-2');
        cosmos.setBech32MainPrefix("cosmos");
        const ecpairPriv = Buffer.from(pk, 'hex');
        return cosmos.sign(rawMsg, ecpairPriv);
    }

}


function reMap(val): IGetHistoryResponse {
    const array = [];
    val.docs.forEach((x) => {
        const item: IHistoryTx = {
            txHash: x.id,
        blockHeight: x.block,
        txType: 'TRANSFER',
        timeStamp: x.date,
        fromAddr: x.from,
        toAddr: x.to,
        value: x.metadata.value,
        txAsset:  x.metadata.symbol,
        txFee: x.fee,
        txAge: 0,
        orderId: '',
        code: 0,
        data: '',
        confirmBlocks: 0,
        memo: x.memo
    };
       array.push(item);
    });

    const resp: IGetHistoryResponse = {
        total: val.total,
        tx: array
    };
      return resp;
}
