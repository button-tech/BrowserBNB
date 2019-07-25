import {Injectable} from '@angular/core';
import * as Binance from '../../assets/binance/bnbSDK.js';
import {getAddressFromPrivateKey} from './binance-crypto';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {StorageService} from "./storage.service";

@Injectable({
    providedIn: 'root'
})
export class BinanceService {

    binanceInstance: any;
    binanceClient: any;

    endpointList = {
        'MAINNET': 'https://dex.binance.org/',
        'MAINNET_ASIA': 'https://dex-asiapacific.binance.org/',
        'MAINNET_ATLANTIC': 'https://dex-atlantic.binance.org/',
        'MAINNET_EUROPE': 'https://dex-european.binance.org/',
        'TESTNET': 'https://testnet-dex.binance.org/',
        'TESTNET_ASIA': 'https://testnet-dex-asiapacific.binance.org/',
        'TESTNET_ATLANTIC': 'https://testnet-dex-atlantic.binance.org/'
    };

    constructor(private http: HttpClient) {
        this.binanceInstance = Binance.initBNB();
        this.binanceClient = this.initClients(this.endpointList.TESTNET);
    }

    initClients(networkConnection: string): any {
        let client: any;
        try {
            client = Binance.initClient(networkConnection);
            console.log(` BINANCE CLIENT ${Binance.initClient(networkConnection)}`)
        } catch (e) {
            console.assert(e, `Error during binance client init ${e}`);
        }
        return client;
    }

    async sendTransaction(sum: number, addressTo: string, networkAddress: string, networkPrefix: string, coin: string, pk: string, message?: string) {
        const addressFrom = getAddressFromPrivateKey(pk, networkPrefix);
        return this.http.get(`${networkAddress}api/v1/account/${addressFrom}`).subscribe((account: any) => {
            const sequence = account.result && account.result.sequence;

            let hash = Binance.transfer(networkAddress,sum, addressFrom, addressTo, pk, coin, message, sequence);
            console.log(hash)
        });
    }


    getBalance(address: string, endpoint: string): Observable<any> {
        // https://dex-asiapacific.binance.org/api/v1/account/bnb1jxfh2g85q3v0tdq56fnevx6xcxtcnhtsmcu64m
        return this.http.get(`${endpoint}api/v1/account/${address}`).pipe(
            // return this.http.get(`${endpoint}api/v1/account/bnb187tqe4ezg5r6uf5g5rr2vm5z5nqeygt4jr85me`).pipe(
            catchError((error: HttpErrorResponse) => {
                // TODO: properly handle binance 404 response
                return of({
                    balances: []
                });
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
