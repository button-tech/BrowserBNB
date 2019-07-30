import {Injectable} from '@angular/core';
import * as Binance from '../../assets/binance/bnbSDK.js';
import {getAddressFromPrivateKey} from './binance-crypto';
import {from, Observable, of} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import {NETWORK_ENDPOINT_MAPPING} from './network_endpoint_mapping';
import {NetworkType} from './storage.service';

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


    getBalance$(address: string, endpoint: string): Observable<any> {
        return this.http.get(`${endpoint}api/v1/account/${address}`).pipe(
            catchError((error: HttpErrorResponse) => {
                // TODO: properly handle binance 404 response
                // const errResp:  AccountInfo;
                return of({
                        balances: []
                    }
                );
            })
        );
    }
}
