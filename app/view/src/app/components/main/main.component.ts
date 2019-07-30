import {Component} from '@angular/core';
import {combineLatest, Observable, timer} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { map, pluck, shareReplay, switchMap, take, takeUntil } from 'rxjs/operators';
import {ClipboardService} from '../../services/clipboard.service';
import {BinanceService} from '../../services/binance.service';
import {getAddressFromPrivateKey} from '../../services/binance-crypto';
import { StateService } from '../../services/state.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent {

    bnb$: Observable<string>;
    fiat$: Observable<string>;
    address$: Observable<string>;
    shortAddress$: Observable<string>;
    copyMessage = 'Copy to clipboard';

    constructor(public stateService: StateService,
                private http: HttpClient,
                private clipboardService: ClipboardService,
                private bncService: BinanceService
    ) {

        // this.stateService.uiState$.pipe(
        //     pluck('currentAccount'),
        //     pluck('currentAccount')
        // );

        this.address$ = combineLatest([this.storage.currentAccount$, this.storage.selectedNetwork$]).pipe(
            map((x: any[]) => {
                const [account, network] = x;
                const pk = account.privateKey;
                const networkPrefix = network.networkPrefix;
                return getAddressFromPrivateKey(pk, networkPrefix);
            })
        );

        this.shortAddress$ = this.address$.pipe(
            map((address) => {
                const start = address.substring(0, 5);
                const end = address.substring(address.length - 6, address.length);
                return `${start}...${end}`;
            })
        );

        const timer$ = timer(0, 4000);

        const balances$ = combineLatest([this.address$, this.storage.selectedNetwork$, timer$]).pipe(
            switchMap((x: any[]) => {
                const [address, networkMenuItem] = x;
                const endpoint = networkMenuItem.val;
                return this.bncService.getBalance(address, endpoint);
            }),
            shareReplay(1)
        );

        const pluckBalance = (response: any, coinSymbol: string) => {
            const balances = response.balances || [];
            const item = balances.find((x) => x.symbol === coinSymbol);
            return item ? item.free : 0;
        };

        const bnbBalance$ = balances$.pipe(
            map((response) => pluckBalance(response, 'BNB'))
        );

        this.bnb$ = bnbBalance$.pipe(
            map((bnbAmount) => `${bnbAmount} BNB`),
        );

        const bnb2usdRate$ = timer(0, 60000).pipe(
            switchMap(() => {
                return this.http.get('https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=USD');
            }),
            map((resp: any) => resp.USD)
        );

        this.fiat$ = combineLatest([bnbBalance$, bnb2usdRate$]).pipe(
            map((arr: any[]) => {
                const [bnb, rate] = arr;
                const fiat = (bnb * rate);
                const truncated = (Math.floor(fiat * 100) / 100).toFixed(2);
                return `$ ${truncated} USD`;
            }),
            shareReplay(1)
        );
    }

    copyAddress() {
        // TODO: probable better to do that without observables, by just assiging address to MainComponent field
        this.address$.pipe(
            takeUntil(timer(100)),
            take(1),
        ).subscribe((address) => {
            this.clipboardService.copyToClipboard(address);
            this.copyMessage = 'Copied ✔';
        });
    }
}
