import {Component, OnInit} from '@angular/core';
import {BinanceService, IBalance} from '../../../services/binance.service';
import {StorageService} from '../../../services/storage.service';
import {Observable, of, combineLatest, timer} from 'rxjs';
import {Location} from '@angular/common';
import {map, shareReplay, switchMap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {rawTokensImg} from '../../../constants';
import {LoadersCSS} from 'ngx-loaders-css';
import {StateService} from "../../../services/state.service";

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
                private http: HttpClient,
                private stateService: StateService) {
    }

    ngOnInit() {
        const balances$ = this.stateService.allBalances$;
        const bnb2usdRate$ = this.stateService.bnbBalanceInUsd$;
        const marketRates$ = this.stateService.marketRates$;

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
                            && tokensDetailsForCurrentToken.name !== undefined
                            && tokensDetailsForCurrentToken.mappedAsset !== undefined
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
                        } else if (token.symbol !== 'BNB'
                            && tokensDetailsForCurrentToken
                            && tokensDetailsForCurrentToken.name !== undefined
                            && tokensDetailsForCurrentToken.mappedAsset !== undefined
                        ) {
                            finalBalances.push({
                                'symbol': token.symbol,
                                'balance2usd': 0,
                                'balance': Number(token.free),
                                'image': '',
                                'name': tokensDetailsForCurrentToken.name,
                                'mappedName': tokensDetailsForCurrentToken.mappedAsset,
                            });
                        } else if (tokensDetailsForCurrentToken &&
                            tokensDetailsForCurrentToken.name === undefined &&
                            tokensDetailsForCurrentToken.mappedAsset !== undefined) {
                            finalBalances.push({
                                'symbol': token.symbol,
                                'balance2usd': 0,
                                'balance': Number(token.free),
                                'image': '',
                                'name': '',
                                'mappedName': tokensDetailsForCurrentToken.mappedAsset,
                            });
                        } else if (tokensDetailsForCurrentToken
                            && tokensDetailsForCurrentToken.name !== undefined
                            && tokensDetailsForCurrentToken.mappedAsset === undefined) {
                            finalBalances.push({
                                'symbol': token.symbol,
                                'balance2usd': 0,
                                'balance': Number(token.free),
                                'image': '',
                                'name': tokensDetailsForCurrentToken.name,
                                'mappedName': '',
                            });
                        } else if (!tokensDetailsForCurrentToken) {
                            finalBalances.push({
                                'symbol': token.symbol,
                                'balance2usd': 0,
                                'balance': Number(token.free),
                                'image': '',
                                'name': token.symbol,
                                'mappedName': token.symbol,
                            });
                        }
                    });

                    return finalBalances.sort((a, b) => {
                        const usdBalanceDiff = b.balance2usd - a.balance2usd;
                        if (usdBalanceDiff === 0) {
                            const balanceDiff = b.balance - a.balance;
                            if (balanceDiff === 0) {
                                return a.symbol > b.symbol ? 1 : -1;
                            }
                            return balanceDiff;
                        }
                        return usdBalanceDiff;
                    });
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
