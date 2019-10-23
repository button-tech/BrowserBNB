import {
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, of, Subscription} from "rxjs";
import {filter, map, switchMap, tap} from "rxjs/operators";
import {IMarketRates, StateService} from "../../../../../services/state.service";

interface IAmounts {
    baseSymbol: string;
    secondarySymbol: string;
    calculatedSum: number;
    rate2usd: number;
}

interface IMySymbol {
    baseSymbol: string;
    secondarySymbol: string;
}

const initialSymbols: IMySymbol = {
    baseSymbol: 'BNB',
    secondarySymbol: 'usd'
};

@Component({
    selector: 'app-amount-input',
    templateUrl: './amount-input.component.html',
    styleUrls: ['./amount-input.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AmountInputComponent implements OnDestroy, OnChanges {

    baseSymbol: string;
    calculatedSum: number;

    secondarySymbol = 'USD';
    currentState$: Observable<IAmounts>;
    currentState: IAmounts;

    userInput$: BehaviorSubject<string | number> = new BehaviorSubject(0);
    userInputIsInFiat$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    exchangeRateIsAvailable = false;

    selectedToken$: BehaviorSubject<string> = new BehaviorSubject('BNB');

    // @ts-ignore
    @ViewChild('sum')
    inputElement: ElementRef;

    @Input()
    selectedToken: string;

    @Output()
    amount: number;

    baseAmount = 0;

    subscription: Subscription;

    constructor(stateService: StateService) {

        const {marketRates$, bnb2fiatRate$} = stateService;

        const priceInUsd$ = this.buildUsdPricePipeLine(stateService);
        const sources$ = [this.selectedToken$, priceInUsd$, this.userInputIsInFiat$, this.userInput$];

        // sideEffect$
        // this.userInput$ --()--> filter for 0
        // if (!userInput || (+userInput) < 0) {
        //     this.baseAmount = 0;
        // }


        //
        // userInputIsInFiat, priceInUsd
        //
        //

        const sideEffect$ = combineLatest([this.selectedToken$, priceInUsd$]).pipe(
            tap((x: [string, number]) => {
                const [selectedToken, priceInUsd] = x;

                if (isNaN(priceInUsd) || priceInUsd <= 0) {
                    this.exchangeRateIsAvailable = false;
                    this.baseSymbol = '' + selectedToken;
                    this.secondarySymbol = 'USD';
                    // switchMap --()-->
                } else {
                    this.exchangeRateIsAvailable = true;
                    // switchMap --( allow switcher)-->
                }
            })
        );

        this.subscription = combineLatest(sources$).pipe(
            tap((x: [string, boolean, string, number]) => {
                const [selectedToken, priceInUsd, userInputIsInFiat, userInput] = x;

                if (!userInput || (+userInput) < 0) {
                    this.baseAmount = 0;
                }

                if (userInputIsInFiat) {
                    this.baseSymbol = 'USD';
                    this.secondarySymbol = selectedToken;
                    this.calculatedSum = +((1 / priceInUsd) * (+userInput)).toFixed(4);
                } else {
                    this.baseSymbol = '' + selectedToken;
                    this.secondarySymbol = 'USD';
                    this.calculatedSum = +(priceInUsd * (+userInput)).toFixed(2);
                }
            }),
        ).subscribe(() => {
            // next - amount
        });
    }

    buildUsdPricePipeLine(stateService: StateService): Observable<number> {
        const {marketRates$, bnb2fiatRate$} = stateService;

        return this.selectedToken$.pipe(
            switchMap((selectedToken: string) => {

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
            })
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges): void {
        const value = changes.selectedToken.currentValue;
        this.selectedToken$.next(value);
    }

    changeInputMode() {
        // Allow input mode change only exchange rate is available
        if (this.exchangeRateIsAvailable) {
            const newMode = !this.userInputIsInFiat$.value;
            this.userInputIsInFiat$.next(!newMode);
        }
    }
}
