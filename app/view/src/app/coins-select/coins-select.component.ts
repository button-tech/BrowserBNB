import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {BehaviorSubject, combineLatest, Observable, Subscription, timer} from "rxjs";
import {map, pluck, shareReplay, switchMap, take, takeUntil} from "rxjs/operators";
import {CurrentAccountService} from "../services/current-account.service";
import {StorageService} from "../services/storage.service";
import {AuthService} from "../services/auth.service";
import {HttpClient} from "@angular/common/http";
import {ClipboardService} from "../services/clipboard.service";
import {BinanceService} from "../services/binance.service";

interface MenuItem {
    label: string;
    val: string;
}

@Component({
    selector: 'app-coins-select',
    templateUrl: './coins-select.component.html',
    styleUrls: ['./coins-select.component.css']
})
export class CoinsSelectComponent implements OnInit {
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
    heroForm: FormGroup;

    constructor(private fb: FormBuilder,
                public currentAccount: CurrentAccountService,
                public storage: StorageService,
                private authService: AuthService,
                private http: HttpClient,
                private clipboardService: ClipboardService,
                private bncService: BinanceService) {
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

    ngOnInit() {
        this.heroForm = this.fb.group({
            heroId: 'BNB',
            agree: null
        });

        this.storage.currentTransaction.Symbol = this.heroForm.getRawValue().heroId
    }
}
