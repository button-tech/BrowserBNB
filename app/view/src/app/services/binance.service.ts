import {Injectable} from '@angular/core';
import * as Binance from '../../assets/binance/bnbSDK.js';
import {getAddressFromPrivateKey} from './binance-crypto';
import {from, Observable, of} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, pluck, switchMap, tap} from 'rxjs/operators';
import {NETWORK_ENDPOINT_MAPPING} from './network_endpoint_mapping';
import {NetworkType} from './storage.service';


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
export class BinanceService {

    constructor(private http: HttpClient) {
    }

    async sendTransaction(sum: number, addressTo: string,
                          networkType: NetworkType,
                          endpoint: NETWORK_ENDPOINT_MAPPING,
                          networkPrefix: string,
                          coin: string,
                          privateKey: string,
                          message?: string): Promise<void> {


        try {

            const client = await Binance.initClient(endpoint);
            await client.chooseNetwork(networkType === 'bnb' ? 'mainnet' : 'testnet');
            await client.initChain();
            await client.setPrivateKey(privateKey);
            const addressFrom = getAddressFromPrivateKey(privateKey, networkType);

            const url = `${endpoint}api/v1/account/${addressFrom}`;
            const account = await this.http.get(url).toPromise<any>();
            const sequence = account.result && account.result.sequence;
            return await client.transfer(addressFrom, addressTo, sum, coin, message, sequence);

        } catch (e) {
            console.log(e);
        }

    }


    getBalance$(address: string, endpoint: string): Observable<IBalance[]> {
        return this.http.get(`${endpoint}api/v1/account/${address}`).pipe(
            map((response: IGetBalanceResponse) => {
                return response.balances;
            }),
            catchError((error: HttpErrorResponse) => {
                // TODO: properly handle binance 404 response
                // const errResp:  AccountInfo;
                return of([]);
            })
        );
    }

    getHistory$(address: string, endpoint: string): Observable<IHistoryTx[]> {
        const unix_time = +Date.now();
        const ninety_days_in_seconds = (86400 * 90) * 1000;
        const startTime = unix_time - ninety_days_in_seconds;

        return this.http.get(`${endpoint}api/v1/transactions?address=${address}&startTime=${startTime}`)
            .pipe(
                map((response: IGetHistoryResponse) => {
                    return response.tx;
                }),
                catchError((error: HttpErrorResponse) => {
                    // TODO: properly handle binance 404 response
                    return of([]);
                })
            );
    }
}
