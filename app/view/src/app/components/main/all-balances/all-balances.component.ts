import {Component, OnInit} from '@angular/core';
import {BinanceService} from "../../../services/binance.service";
import {StorageService} from "../../../services/storage.service";
import {Observable, of, combineLatest, timer} from "rxjs";
import {Location} from "@angular/common";
import {map, shareReplay, switchMap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {rawTokensImg} from '../../../constants';
import {LoadersCSS} from 'ngx-loaders-css';
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
                return this.bncService.getBalance('bnb1jxfh2g85q3v0tdq56fnevx6xcxtcnhtsmcu64m', ' https://dex.binance.org/');
            }),
            map((resp: any) => {
                return resp.balances
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
                        }

                    });
                    return finalBalances.sort((a, b) => parseFloat(a.balance2usd) - parseFloat(b.balance2usd));
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