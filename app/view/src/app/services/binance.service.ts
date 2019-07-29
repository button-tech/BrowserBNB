import {Injectable} from '@angular/core';
import * as Binance from '../../assets/binance/bnbSDK.js';
import {getAddressFromPrivateKey} from './binance-crypto';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {NETWORK_ENDPOINT_MAPPING} from './network_endpoint_mapping';

@Injectable({
    providedIn: 'root'
})
export class BinanceService {

    binanceInstance: any;
    binanceClient: any;

    constructor(private http: HttpClient) {
        this.binanceInstance = Binance.initBNB();
        this.initClients(NETWORK_ENDPOINT_MAPPING.TESTNET).then((client) => {
            this.binanceClient = client;
        });
    }

    async initClients(networkConnection: string): Promise<any> {
        try {
            return await Binance.initClient(networkConnection);
        } catch (e) {
            console.assert(e, `Error during binance client init ${e}`);
        }
    }

    async sendTransaction(sum: number, addressTo: string, networkAddress: string, networkPrefix: string,
                          coin: string, pk: string, message?: string) {
        const client = this.binanceClient;
        await client.chooseNetwork('testnet');
        await client.initChain();
        await client.setPrivateKey(pk);
        const addressFrom = getAddressFromPrivateKey(pk, networkPrefix);

        const url = `${networkAddress}api/v1/account/${addressFrom}`;
        return this.http.get(url).pipe(
            map(async (account: any) => {
                const sequence = account.result && account.result.sequence;

                return await client.transfer(addressFrom, addressTo, sum, coin, message, sequence);
            })
        ).subscribe(console.log);
    }


    getBalance(address: string, endpoint: string): Observable<any> {
        // https://dex-asiapacific.binance.org/api/v1/account/bnb1jxfh2g85q3v0tdq56fnevx6xcxtcnhtsmcu64m
        return this.http.get(`${endpoint}api/v1/account/${address}`).pipe(
            // return this.http.get(`${endpoint}api/v1/account/bnb187tqe4ezg5r6uf5g5rr2vm5z5nqeygt4jr85me`).pipe(
            catchError((error: HttpErrorResponse) => {
                // // TODO: properly handle binance 404 response
                // const errResp:  AccountInfo;
                return of({
                        balances: []
                    }
                );
            })
        );
    }

    getBalanceOfCoin(address: string, coin: string) {
    }

    getFiatBalance(coin: string, fiatCoin: string) {

    }

    getTransactionsHistory(address: string) {
    }
}
