import {Injectable} from '@angular/core';
import * as Binance from '../../assets/binance/bnbSDK.js';
import {getAddressFromPrivateKey} from './binance-crypto';
import {timer} from "rxjs";
import {map, shareReplay, switchMap} from "rxjs/operators";
import {HttpClient} from '@angular/common/http'

@Injectable({
    providedIn: 'root'
})
export class BinanceService {

    binanceInstance: any;
    binanceClient: any;

    networksList: {
        'MAINNET': 'https://dex.binance.org/',
        'MAINNET_ASIA': 'https://dex-asiapacific.binance.org/',
        'MAINNET_ATLANTIC': 'https://dex-atlantic.binance.org/',
        'MAINNET_EUROPE': 'https://dex-european.binance.org/',
        'TESTNET': 'https://testnet-dex.binance.org',
        'TESTNET_ASIA': 'https://testnet-dex-asiapacific.binance.org',
        'TESTNET_ATLANTIC': 'https://testnet-dex-atlantic.binance.org'
    };

    constructor(private http: HttpClient) {
        this.binanceInstance = Binance.initBNB();
        this.binanceClient = this.initClient(this.networksList.MAINNET);
    }

    initClient(networkConnection: string): any {
        let client: any;
        try {
            client = this.binanceInstance(networkConnection);
        } catch (e) {
            console.assert(e, `Error during binance client init ${e}`);
        }
        return client;
    }

    async sendTransaction(sum: number, addressTo: string, coin: string, privateKey: string, message?: string) {
        const addressFrom = getAddressFromPrivateKey(privateKey);
        let account: any;
        try {
            account = await this.binanceClient._httpClient.request("get", `/api/v1/account/${addressFrom}`);
        }
        catch (e) {
            console.assert(e, `Error during sendTransaction ${e}`);
        }

        const sequence = account.result && account.result.sequence;

        return this.binanceClient.transfer(addressFrom, addressTo, sum, coin, message, sequence);
    }

    getBalance(address: string) {
        const obv = timer(0, 60000).pipe(
            switchMap(() => {
                return this.http.get(`${this.networksList.MAINNET}/api/v1/account/${address}`);
            }),
            map((resp: any) => !resp.length ? 0 : BinanceService.getBnbBalance(resp)),
            shareReplay(1)
        );
    }

    static getBnbBalance(resp: any) {
        const bnb = resp.find((x) => x.symbol === 'BNB');
        return bnb ? bnb.free : 0;
    };

    getBalanceOfCoin(address: string, coin: string) {
    }

    getFiatBalance(coin: string, fiatCoin: string) {

    }

    getTransactionsHistory(address: string) {
    }


}
