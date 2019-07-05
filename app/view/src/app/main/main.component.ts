import {Component, Input} from '@angular/core';
import {MemoryService} from '../services/memory.service';
import * as Binance from '../../assets/binance/bnbSDK.js';
import {combineLatest, from, Observable, timer} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map, shareReplay, switchMap} from 'rxjs/operators';


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
    shortAddress$: Observable<string>;
    copyMessage = 'Copy to clipboard';
    selectedNetwork: string;

    networkMenu: MenuItem[] = [
        {val: 'TESTNET'},
        {val: 'MAINNET'},
    ];

    usersMenu: MenuItem[] = [];

    constructor(private memory: MemoryService, private http: HttpClient) {

        this.selectedNetwork = 'MAINNET';

        const getBnbBalance = (resp: any) => {
            const bnb = resp.find((x) => x.symbol === 'BNB');
            return bnb ? bnb.free : 0;
        };


        const bnbRaw$ = timer(0, 4000).pipe(
            switchMap(() => {
                const address = this.memory.getCurrentAddress();
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

        this.fiat$ = combineLatest(bnbRaw$, bnb2usdRate$).pipe(
            map((arr: any[]) => {
                const [bnb, rate] = arr;
                const fiat = (bnb * rate);
                const truncated = (Math.floor(fiat * 100) / 100).toFixed(2);
                return `$ ${truncated} USD`;
            }),
            shareReplay(1)
        );

        this.shortAddress$ = this.memory.currentAddress.pipe(
            map((address) => {
                const start = address.substring(0, 5);
                const end = address.substring(address.length - 6, address.length);
                return `${start}...${end}`;
            })
        );
    }

    updateUsersList() {
        this.usersMenu = [
            {val: this.accountName},
            {val: 'Job'},
            {val: 'Personal'},
            {val: 'Team'},
            {val: 'DeFi'},
        ]
    }

    selectNetwork(value: string) {
        this.selectedNetwork = value;
    }

    selectUser(value: string) {
        this.accountName = value;
    }

    copyAddress() {
        this.copyMessage = 'Copied';
        const obj = document.createElement('textarea');
        obj.style.position = 'fixed';
        obj.style.left = '0';
        obj.style.top = '0';
        obj.style.opacity = '0';
        obj.value = this.memory.getCurrentAddress();
        document.body.appendChild(obj);
        obj.focus();
        obj.select();
        document.execCommand('copy');
        document.body.removeChild(obj);
    }
}
