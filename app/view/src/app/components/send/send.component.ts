import {Component, OnDestroy} from '@angular/core';
import {isAddressValid} from '../../services/binance-crypto';
import {BehaviorSubject, combineLatest, interval, Observable, of, Subscription, timer, merge, Subject} from 'rxjs';
import {IMarketRates, INetworkMenuItem, ITokenInfo, ITransaction, StateService} from "../../services/state.service";
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
import {Location} from '@angular/common';
import {distinctUntilChanged, map, switchMap, take, takeUntil, tap} from "rxjs/operators";
import {BinanceService} from "../../services/binance.service";

@Component({
    selector: 'app-send',
    templateUrl: './send.component.html',
    styleUrls: ['./send.component.css']
})
export class SendComponent implements OnDestroy {
    selectedToken$: BehaviorSubject<string> = new BehaviorSubject('ATOM');
    showVerifyForm = false;

    // rate2usd is exchange rate of token that is currently selected with select control
    rate2usd = NaN;
    bnbTransferFee: number;
    bnbTransferFeeFiat: number;

    get hasRate2usd(): boolean {
        return isNaN(this.rate2usd);
    }

    balance = 0;
    networkPrefix: string;

    get selectedToken(): string {
        return this.selectedToken$.value;
    }

    set selectedToken(value: string) {
        this.selectedToken$.next(value);
    }

    get amount(): AbstractControl {
        return this.formGroup.get('amount');
    }

    get address(): AbstractControl {
        return this.formGroup.get('address');
    }

    get memo(): AbstractControl {
        return this.formGroup.get('memo');
    }

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

    // TODO: checkout the subscriptions with *ngIg ang ng-content
    subscriptions: Subscription;

    // Root subscription

    constructor(public fb: FormBuilder,
                public router: Router,
                public stateService: StateService,
                public location: Location,
                public bncService: BinanceService) {

        const {tokens$, bnb2fiatRate$, marketRates$, selectedNetwork$, simpleFee$} = this.stateService;

        const balance$ = combineLatest([this.selectedToken$, tokens$]).pipe(
            map((x: [string, ITokenInfo[]]) => {
                const [selectedToken, tokens] = x;
                const token = tokens.find((t: ITokenInfo) => {
                    if (selectedToken === 'ATOM') {
                        return t.symbol === 'uatom';
                    }
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
            tap((selectedNetwork: INetworkMenuItem) => {
                this.networkPrefix = selectedNetwork.networkPrefix;
                this.address.updateValueAndValidity();
            })
        );

        this.subscriptions = merge(balance$, network$).subscribe();


        // fees subscription
        this.subscriptions.add(
            combineLatest([simpleFee$, bnb2fiatRate$]).pipe(
                tap((x: [number, number]) => {
                    const [feeInBnb, bnb2fiatRate] = x;
                    this.bnbTransferFee = feeInBnb;
                    this.bnbTransferFeeFiat = feeInBnb * bnb2fiatRate;
                })
            ).subscribe()
        );

        // fees rate2usd subscription
        this.subscriptions.add(
            this.selectedToken$.pipe(
                switchMap((selectedToken: string) => {
                    // TODO: check that marketRates$ are already available
                    return this.buildUsdPricePipeLine(selectedToken, bnb2fiatRate$, marketRates$);
                }),
                tap(
                    (rate2usd: number) => {
                        this.rate2usd = rate2usd;
                    }
                )
            ).subscribe()
        );

        // isCosmos
        this.subscriptions.add(
            this.stateService.isCosmos$.pipe()
                .subscribe((isCosmos) => {
                    this.selectedToken = isCosmos ? 'ATOM' : 'BNB';
                })
        );
    }

    // Build on top of selectedToken
    buildUsdPricePipeLine(selectedToken: string, bnb2fiatRate$, marketRates$): Observable<number> {
        // Simple case for BNB
        // debugger
        if (selectedToken === "BNB" || selectedToken === "ATOM") {
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

    goBack(): void {
        this.location.back();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onNextBtnClick() {
        this.showVerifyForm = true;
    }

    sendTx(): void {
        const privateKey = this.stateService.uiState.currentAccount.privateKey;
        const network = this.stateService.selectedNetwork$.getValue(); // TODO: Should be the that was verified

        this.bncService.sendTransaction(
            +this.amount.value,
            this.address.value,
            network.label,
            network.val,
            network.networkPrefix,
            this.selectedToken,
            privateKey,
            this.memo.value
        ).then((result) => {
            console.log(result);
        }, (err) => {
            console.error(err);
        });
    }

    onVerify() {
        this.sendTx(); // TODO: progress dialog during the send
        this.router.navigate(['/main']);
        // this.showVerifyForm = false;
    }

    onReject() {
        this.showVerifyForm = false;
    }
}
