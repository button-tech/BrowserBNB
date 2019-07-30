import {Component, OnInit} from '@angular/core';
import {BinanceService} from '../../../services/binance.service';
import {StorageService} from '../../../services/storage.service';
import {Observable, of, combineLatest, timer} from 'rxjs';
import {Location} from '@angular/common';
import {map, shareReplay, switchMap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {rawTokensImg} from '../../../constants';
import {LoadersCSS} from 'ngx-loaders-css';

export interface ITokenInfo {
    balance: string,
    balance2usd: number,
    balance2usdStr: string,
    image: string,
    mappedName: string,
    name: string,
    symbol: string,
}

@Component({
    selector: 'app-all-balances',
    templateUrl: './all-balances.component.html',
    styleUrls: ['./all-balances.component.css'],
})
export class AllBalancesComponent implements OnInit {
    tokens$: Observable<any>;
    loader: LoadersCSS = 'line-scale';
    bgColor = 'white';
    color = 'rgb(239, 184, 11) ';

    constructor(private bncService: BinanceService,
                private storage: StorageService,
                private location: Location,
                private http: HttpClient) {
    }

    ngOnInit() {
        const timer$ = timer(0, 4000);
        const balances$ = timer$.pipe(
            switchMap(() => {
                //TODO: add current address and current endpoint
                return this.bncService.getBalance$('bnb1jxfh2g85q3v0tdq56fnevx6xcxtcnhtsmcu64m', ' https://dex.binance.org/');
            }),
            map((resp: any) => {
                return resp.balances;
            })
        );

        const bnb2usdRate$ = timer(0, 60000).pipe(
            switchMap(() => {
                return this.http.get('https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=USD');
            }),
            map((resp: any) => resp.USD)
        );

        const marketRates$ = timer$.pipe(
            switchMap(() => {
                return this.http.get('https://dex.binance.org/api/v1/ticker/24hr');
            }),
            map((resp: any) => resp)
        );


        this.tokens$ = combineLatest([balances$, marketRates$, bnb2usdRate$])
            .pipe(
                map((x: any[]) => {
                    const [balances, marketRates, bnb2usd] = x;
                    const imagesUrls = JSON.parse(rawTokensImg);
                    let finalBalances = [];
                    balances.forEach((token) => {
                        const marketTickerForCurrentToken = marketRates.find(o => o.baseAssetName === token.symbol);
                        const tokensDetailsForCurrentToken = imagesUrls.find(o => o.symbol === token.symbol);
                        const isOk =
                            marketTickerForCurrentToken !== undefined
                            && tokensDetailsForCurrentToken !== undefined
                            && token.symbol !== 'BNB';

                        if (isOk) {
                            finalBalances.push({
                                'symbol': token.symbol,
                                'balance2usd': Number(marketTickerForCurrentToken.lastPrice) * bnb2usd * Number(token.free),
                                'balance': Number(token.free),
                                'image': tokensDetailsForCurrentToken.image,
                                'name': tokensDetailsForCurrentToken.name,
                                'mappedName': tokensDetailsForCurrentToken.mappedAsset,
                            });
                        } else if (token.symbol !== 'BNB') {
                            finalBalances.push({
                                'symbol': token.symbol,
                                'balance2usd': 0,
                                'balance': Number(token.free),
                                'image': '',
                                'name': tokensDetailsForCurrentToken.name,
                                'mappedName': tokensDetailsForCurrentToken.mappedAsset,
                            });
                        }

                    });

                    return finalBalances.sort((a, b) => {
                        const usdBalanceDiff = parseFloat(b.balance2usd) - parseFloat(a.balance2usd);
                        return usdBalanceDiff || (b.balance > a.balance ? 1 : -1);
                    });

                    // return finalBalances.sort((a, b) => parseFloat(b.balance2usd) - parseFloat(a.balance2usd));

                    // const [balances, marketRates, bnb2usd] = x;
                    // const imagesUrls = JSON.parse(rawTokensImg);
                    // const finalBalances: Array<ITokenInfo> = [];
                    //
                    //
                    // for (let token of balances) {
                    //
                    //     if (token.symbol === 'BNB') {
                    //         continue;
                    //     }
                    //
                    //     const marketTicker = marketRates.find(o => o.baseAssetName === token.symbol) || 0;
                    //     const balance2usd = marketTicker.lastPrice * bnb2usd * token.free;
                    //     const balance2usdStr = balance2usd ? `$${balance2usd.toFixed(2)} USD` : '';
                    //
                    //     const tokensDetails = imagesUrls.find(o => o.symbol === token.symbol);
                    //
                    //     finalBalances.push({
                    //         'symbol': token.symbol,
                    //         'balance2usd': balance2usd,
                    //         'balance2usdStr': balance2usdStr,
                    //         'balance': Number(token.free).toFixed(8),
                    //         'image': tokensDetails && tokensDetails.image,
                    //         'name': tokensDetails.name,
                    //         'mappedName': tokensDetails.mappedAsset,
                    //     });
                    // }
                    //
                    // return finalBalances.sort((a, b) => {
                    //     const usdBalanceDiff = a.balance2usd - b.balance2usd;
                    //     if (!usdBalanceDiff) {
                    //         console.log(a, b, a.balance > b.balance ? 1 : -1);
                    //     }
                    //     return usdBalanceDiff || (a.symbol > b.symbol ? 1 : -1);
                    // });

                    // return finalBalances.sort((a, b) => {
                    //     const usdBalanceDiff = parseFloat(''+a.balance2usd) - parseFloat(''+b.balance2usd);
                    //     if (usdBalanceDiff !== 0) {
                    //         return usdBalanceDiff > 0 ? 1 : -1;
                    //     }
                    //
                    //     const balanceDiff = parseFloat(a.balance) - parseFloat(b.balance);
                    //     if (balanceDiff !== 0) {
                    //         return balanceDiff > 0 ? 1 : -1;
                    //     }
                    //
                    //     return a.symbol > b.symbol ? 1 : -1;
                    // });
                }),
                shareReplay(1));
    }

    goBack() {
        this.location.back();
    }

    makeItShort(st: string) {
        if (st.length > 28) {
            return st.substring(0, 25) + '...';
        }
        return st;

    }
}
