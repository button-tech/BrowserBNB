import {Injectable} from '@angular/core';
import * as Binance from '../../assets/binance/bnbSDK.js';

@Injectable({
    providedIn: 'root'
})
export class BinanceService {

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
    }


}
