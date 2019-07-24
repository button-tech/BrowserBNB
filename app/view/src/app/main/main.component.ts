import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, Subscription, timer} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map, pluck, shareReplay, switchMap, take, takeUntil} from 'rxjs/operators';
import {ClipboardService} from '../services/clipboard.service';
import {StorageService} from '../services/storage.service';
import {AuthService} from '../services/auth.service';
import {CurrentAccountService} from '../services/current-account.service';
import {BinanceService} from '../services/binance.service';

interface MenuItem {
    label: string;
    val: string;
}

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements OnDestroy {

    // @ts-ignore
    @ViewChild('menuNetwork')
    menuNetwork: ElementRef;

    bnb$: Observable<string>;
    fiat$: Observable<string>;
    address$: Observable<string>;
    shortAddress$: Observable<string>;
    copyMessage = 'Copy to clipboard';
    selectedNetwork$: BehaviorSubject<MenuItem>;
    subscription: Subscription;

    networkMenu: MenuItem[];

    userItems: MenuItem[] = [];

    constructor(public currentAccount: CurrentAccountService,
                public storage: StorageService,
                private authService: AuthService,
                private http: HttpClient,
                private clipboardService: ClipboardService,
                private bncService: BinanceService
    ) {

        this.networkMenu = [
            {
                label: 'MAINNET',
                val: bncService.endpointList.MAINNET
            },
            {
                label: 'TESTNET',
                val: bncService.endpointList.TESTNET
            },
        ];

        this.selectedNetwork$ = new BehaviorSubject(this.networkMenu[0]);

        this.subscription = this.storage.storageData$.subscribe((x) => {
            this.userItems = x.AccountList.map((acc) => {
                return {
                    label: acc.accountName,
                    val: acc.accountName
                };
            });
        });

        // this.binanceService.getBalance(, 'BNB');
        // const getBnbBalance = (resp: any) => {
        //     const bnb = resp.find((x) => x.symbol === 'BNB');
        //     return bnb ? bnb.free : 0;
        // };

        this.address$ = this.storage.currentAccount$.pipe(
            pluck('address')
        );

        this.shortAddress$ = this.address$.pipe(
            map((address) => {
                const start = address.substring(0, 5);
                const end = address.substring(address.length - 6, address.length);
                return `${start}...${end}`;
            })
        );

        const timer$ = timer(0, 4000);

        const balances$ = combineLatest([this.address$, this.selectedNetwork$, timer$]).pipe(
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

    selectNetwork(value: MenuItem) {
        this.selectedNetwork$.next(value);
    }

    selectUser(value: string) {
        // this.currentAccount.accountName = value;
    }

    copyAddress() {
        // TODO: probable better to do that without observables, by just assiging address to MainComponent field
        this.address$.pipe(
            takeUntil(timer(100)),
            take(1),
        ).subscribe((address) => {
            this.clipboardService.copyToClipboard(address);
            this.copyMessage = 'Copied';
        });
    }

    logout() {
        this.authService.logout();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
