import {Component, OnDestroy} from '@angular/core';
import {isAddressValid} from '../../../services/binance-crypto';
import {BehaviorSubject, combineLatest, interval, Observable, of, Subscription, timer, merge} from 'rxjs';
import {IMenuItem, ITokenInfo, StateService} from "../../../services/state.service";
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

    get selectedToken() {
        return this.selectedToken$.value;
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

        this.subscription = combineLatest([bnb2fiatRate$, marketRates$])
            .pipe().subscribe();
    }

    onCoinSelected(coin: string) {
        console.log(coin);
        this.selectedToken$.next(coin);
    }

    goBack() {
        this.router.navigate(['/main']);
    }

    ngOnDestroy(): void {
        this.formValidationSubscription.unsubscribe();
        this.subscription.unsubscribe();
    }


}

