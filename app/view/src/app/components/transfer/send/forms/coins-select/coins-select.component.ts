import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {BehaviorSubject, combineLatest, Observable, Subscription, timer} from "rxjs";
import {map, pluck, shareReplay, switchMap, take, takeUntil} from "rxjs/operators";
import {CurrentAccountService} from "../../../../../services/current-account.service";
import {StorageService} from "../../../../../services/storage.service";
import {AuthService} from "../../../../../services/auth.service";
import {HttpClient} from "@angular/common/http";
import {ClipboardService} from "../../../../../services/clipboard.service";
import {BinanceService} from "../../../../../services/binance.service";
import {getAddressFromPrivateKey} from "../../../../../services/binance-crypto";


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
    copyMessage = 'Copy to clipboard';
    chosenCurrency: string;

    subscription: Subscription;


    heroForm: FormGroup;

    constructor(private fb: FormBuilder,
                public storage: StorageService,
                private authService: AuthService,
                private http: HttpClient,
                private clipboardService: ClipboardService,
                private bncService: BinanceService) {



        const timer$ = timer(0, 4000);

        const {currentAccount$, selectedNetwork$} = this.storage;

        // TODO: address should come from state service
        const address$ = combineLatest([currentAccount$, selectedNetwork$]).pipe(
            map((x: any[]) => {
                const [account, network] = x;
                const pk = account.privateKey;
                const networkPrefix = network.networkPrefix;
                return getAddressFromPrivateKey(pk, networkPrefix);
            })
        );

        // TODO: address should come from state service
        const balances$ = combineLatest([address$, this.storage.selectedNetwork$, timer$]).pipe(
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
    }


    ngOnInit() {
        this.heroForm = this.fb.group({
            heroId: 'BNB',
            agree: null
        });

        this.storage.currentTransaction.Symbol = this.heroForm.getRawValue().heroId;
    }
}
