import {Component, OnDestroy} from '@angular/core';
import {isAddressValid} from '../../../services/binance-crypto';
import {BehaviorSubject, combineLatest, interval, Observable, of, Subscription, timer, merge} from 'rxjs';
import {IMarketRates, IMenuItem, ITokenInfo, StateService} from "../../../services/state.service";
import {Router} from "@angular/router";
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators
} from "@angular/forms";
import {distinctUntilChanged, map, switchMap, take, tap} from "rxjs/operators";

@Component({
    selector: 'app-send',
    templateUrl: './send.component.html',
    styleUrls: ['./send.component.css']
})
export class SendComponent implements OnDestroy {

    selectedToken$: BehaviorSubject<string> = new BehaviorSubject('BNB');
    rate2usd$: Observable<number>;

    get selectedToken() {
        return this.selectedToken$.value;
    }

    set selectedToken(value: string) {
        this.selectedToken$.next(value);
    }

    balance = 0;
    networkPrefix: string;

    fee: Observable<number>;
    subscription: Subscription;
    formValidationSubscription: Subscription;

    public formGroup: FormGroup = this.fb.group({
            amount: [0,
                [
                    Validators.required,
                    (c: FormControl) => c.value <= 0 ? {min: true} : null,
                    (c: FormControl) => Number(c.value) >= this.balance ? {max: true} : null,
                ]
            ],
            address: ['',
                [
                    Validators.required,
                    (c: FormControl) => isAddressValid(c.value, this.networkPrefix) ? null : {min: true},
                ],
            ],
            memo: [''],
        }
    );

    get amount(): AbstractControl {
        return this.formGroup.get('amount');
    }

    get address(): AbstractControl {
        return this.formGroup.get('address');
    }

    constructor(private fb: FormBuilder, private router: Router, private stateService: StateService) {

        const {tokens$, bnb2fiatRate$, marketRates$, selectedNetwork$} = this.stateService;

        const balance$ = combineLatest([this.selectedToken$, tokens$]).pipe(
            map((x: [string, ITokenInfo[]]) => {
                const [selectedToken, tokens] = x;
                const token = tokens.find((t: ITokenInfo) => {
                    return t.symbol === selectedToken;
                });
                return (token && +token.balance) || 0;
            }),
            distinctUntilChanged(),
            tap((balance) => {
                this.balance = +balance;
                this.amount.updateValueAndValidity();
            })
        );

        const network$ = selectedNetwork$.pipe(
            tap((selectedNetwork: IMenuItem) => {
                this.networkPrefix = selectedNetwork.networkPrefix;
                this.address.updateValueAndValidity();
            })
        );

        this.formValidationSubscription = merge(balance$, network$)
            .subscribe();

        this.rate2usd$ = combineLatest([bnb2fiatRate$, marketRates$]).pipe(
            map(() => {
                return 3;
            })
        );

        this.rate2usd$ = this.selectedToken$.pipe(
            switchMap((selectedToken: string) => {
                // TODO: check that marketRates$ are already available
                return this.buildUsdPricePipeLine(selectedToken, bnb2fiatRate$, marketRates$);
            }),
            // take(1)
        );
    }

    // Build on top of selectedToken
    buildUsdPricePipeLine(selectedToken: string, bnb2fiatRate$, marketRates$): Observable<number> {
        // Simple case for BNB
        if (selectedToken === "BNB") {
            return bnb2fiatRate$;
        }

        // Complicated case for tokens
        return combineLatest([marketRates$, bnb2fiatRate$]).pipe(
            map((x: [IMarketRates[], number]) => {
                const [tokenRates, bnb2usd] = x;
                const ticker = tokenRates.find(o => o.baseAssetName === selectedToken);
                if (!ticker) {
                    return NaN;
                }

                const lastPrice = +(ticker && ticker.lastPrice) || 0;
                return (+lastPrice) * bnb2usd;
            })
        );
    }

    onCoinSelected(coin: string) {
        console.log(coin);
        this.selectedToken = coin;
    }

    goBack() {
        this.router.navigate(['/main']);
    }

    ngOnDestroy(): void {
        this.formValidationSubscription.unsubscribe();
        // this.subscription.unsubscribe();
    }


}

