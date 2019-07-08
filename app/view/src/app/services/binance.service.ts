import {Injectable} from '@angular/core';
import * as Binance from '../../assets/binance/bnbSDK.js';

@Injectable({
    providedIn: 'root'
})
export class BinanceService {

    binanceInstance: any;
    binanceClient: any;

    networksList: {
        "MAIINET": "https://dex.binance.org/",
        "MAIINET_ASIA": "https://dex-asiapacific.binance.org/",
        "MAIINET_ATLANTIC": "https://dex-atlantic.binance.org/",
        "MAIINET_EUROPE": "https://dex-european.binance.org/",
        "TESTNET": "https://testnet-dex.binance.org",
        "TESTNET_ASIA": "https://testnet-dex-asiapacific.binance.org",
        "TESTNET_ATLANTIC": "https://testnet-dex-atlantic.binance.org"
    };

    constructor() {
        this.binanceInstance = Binance.initBNB();
        this.binanceClient = this.initClient(this.networksList.MAIINET);
    }

    initClient(networkConnection: string): any {
        let client: any;
        try {
            client = this.binanceInstance(networkConnection);
        }
        catch (e) {
            console.assert(e, `Error during binance client init ${e}`);
        }
        return client;
    }

    sendTransaction(sum: number, address: string, coin: string, message?: string) {
    }

    getBalance(address: string) {
    }

    getBalanceOfCoin(address: string, coin: string) {
    }

    getTransactionsHistory(address: string) {
    }


}
