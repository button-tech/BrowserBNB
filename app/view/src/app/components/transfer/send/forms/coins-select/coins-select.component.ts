import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BehaviorSubject, combineLatest, Observable, of, Subscription, timer} from 'rxjs';
import {map, pluck, shareReplay, switchMap, take, takeUntil} from 'rxjs/operators';
import {CurrentAccountService} from '../../../../../services/current-account.service';
import {StorageService} from '../../../../../services/storage.service';
import {AuthService} from '../../../../../services/auth.service';
import {HttpClient} from '@angular/common/http';
import {ClipboardService} from '../../../../../services/clipboard.service';
import {BinanceService} from '../../../../../services/binance.service';
import {getAddressFromPrivateKey} from '../../../../../services/binance-crypto';
import {StateService} from '../../../../../services/state.service';


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

    bnb$: Observable<string>;
    chosenCurrency: string;
    heroForm: FormGroup;

    constructor(private fb: FormBuilder,
                public stateService: StateService,
                private authService: AuthService,
                private http: HttpClient,
                private clipboardService: ClipboardService,
                private bncService: BinanceService) {

        // const timer$ = timer(0, 4000);
        //
        // const currentAccount = this.stateService.currentAccount;
        // const selectedNetwork = this.stateService.selectedNetwork;
        // const address = this.stateService.currentAccount.address;
        //
        // // TODO: address should come from state service
        // map((x: any[]) => {
        //     const [account, network] = x;
        //     const pk = account.privateKey;
        //     const networkPrefix = network.networkPrefix;
        //     return getAddressFromPrivateKey(pk, networkPrefix);
        // });
        //
        // // TODO: address should come from state service
        // const balances$ = combineLatest([timer$]).pipe(
        //     switchMap((x: any[]) => {
        //         const endpoint = selectedNetwork.val;
        //         return this.bncService.getBalance(address, endpoint);
        //     }),
        //     shareReplay(1)
        // );
        //
        // const pluckBalance = (response: any, coinSymbol: string) => {
        //     const balances = response.balances || [];
        //     const item = balances.find((x) => x.symbol === coinSymbol);
        //     return item ? item.free : 0;
        // };
        //
        // const bnbBalance$ = balances$.pipe(
        //     map((response) => pluckBalance(response, 'BNB'))
        // );
        //
        // this.bnb$ = bnbBalance$.pipe(
        //     map((bnbAmount) => `${bnbAmount} BNB`),
        // );

        this.bnb$ = of(`55 BNB`);
    }


    ngOnInit() {
        this.heroForm = this.fb.group({
            heroId: 'BNB',
            agree: null
        });

        // TODO: fix - by passing value to the next from
        // this.storage.currentTransaction.Symbol = this.heroForm.getRawValue().heroId;
    }
}
