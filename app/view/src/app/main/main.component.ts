import {Component, Input} from '@angular/core';
import {combineLatest, from, Observable, timer} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map, pluck, shareReplay, switchMap, take, takeUntil} from 'rxjs/operators';
import * as Binance from '../../assets/binance/bnbSDK.js';
import {ClipboardService} from '../services/clipboard.service';
import {StorageService} from '../services/storage.service';
import {AuthService} from '../services/auth.service';


interface MenuItem {
    val: string;
}

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent {

    @Input() accountName = 'First account';

    bnb$: Observable<string>;
    fiat$: Observable<string>;
    address$: Observable<string>;
    shortAddress$: Observable<string>;
    copyMessage = 'Copy to clipboard';
    selectedNetwork: string;

    networkMenu: MenuItem[] = [
        {val: 'TESTNET'},
        {val: 'MAINNET'},
    ];

    usersMenu: MenuItem[] = [];

    constructor(private authService: AuthService, private storage: StorageService, private http: HttpClient, private clipboardService: ClipboardService) {

        this.selectedNetwork = 'MAINNET';

        const getBnbBalance = (resp: any) => {
            const bnb = resp.find((x) => x.symbol === 'BNB');
            return bnb ? bnb.free : 0;
        };

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


        const bnbRaw$ = combineLatest([this.address$, timer$]).pipe(
            switchMap((x) => {
                const [address] = x;
                const binanceRequest$ = Binance.getBalanceOfAddress(address);
                return from(binanceRequest$);
            }),
            map((resp: any) => !resp.length ? 0 : getBnbBalance(resp)),
            shareReplay(1)
        );

        this.bnb$ = bnbRaw$.pipe(
            map((bnb) => `${bnb} BNB`)
        );


        const bnb2usdRate$ = timer(0, 60000).pipe(
            switchMap(() => {
                return this.http.get('https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=USD');
            }),
            map((resp: any) => resp.USD)
        );

        this.fiat$ = combineLatest([bnbRaw$, bnb2usdRate$]).pipe(
            map((arr: any[]) => {
                const [bnb, rate] = arr;
                const fiat = (bnb * rate);
                const truncated = (Math.floor(fiat * 100) / 100).toFixed(2);
                return `$ ${truncated} USD`;
            }),
            shareReplay(1)
        );
    }

    updateUsersList() {
        this.usersMenu = [
            {val: this.accountName},
            {val: 'Job'},
            {val: 'Personal'},
            {val: 'Team'},
            {val: 'DeFi'},
        ];
    }

    selectNetwork(value: string) {
        this.selectedNetwork = value;
    }

    selectUser(value: string) {
        this.accountName = value;
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
}
