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
import {filter, map, switchMap, take, tap} from "rxjs/operators";
import {IMarketRates, StateService} from "../../../../../services/state.service";
import {ControlValueAccessor} from "@angular/forms";

interface IAmounts {
    baseSymbol: string;
    secondarySymbol: string;
    calculatedSum: number;
    rate2usd: number;
}

@Component({
    selector: 'app-amount-input-double-line',
    templateUrl: './amount-input-double-line.component.html',
    styleUrls: ['./amount-input-double-line.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AmountInputDoubleLineComponent implements ControlValueAccessor, OnDestroy, OnChanges {

    value: number;

    onChange: (x: any) => void;
    onTouched: () => void;
    disabled: boolean;


    baseSymbol = 'BNB';
    secondarySymbol = 'USD';

    calculatedSum: number;

    userInput$: BehaviorSubject<string | number> = new BehaviorSubject(0);
    isInFiat$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    selectedToken$: BehaviorSubject<string> = new BehaviorSubject('BNB');

    @Input()
    exchangeRate: number;

    hasExchangeRate() {
        return isNaN(this.exchangeRate);
    }

    // @ts-ignore
    @ViewChild('sum')
    inputElement: ElementRef;

    @Input()
    selectedToken: string;

    @Input()
    coin: string;

    @Output()
    amount: number;



    subscription: Subscription;

    constructor(stateService: StateService) {

        const {marketRates$, bnb2fiatRate$} = stateService;

        const rate2Usd$ = this.selectedToken$.pipe(
            switchMap((selectedToken: string) => {
                // TODO: check that marketRates$ are already available
                return this.buildUsdPricePipeLine(selectedToken, bnb2fiatRate$, marketRates$);
            }),
            tap((rate: number) => {
                debugger
            })
            // take(1) // take rate once on switch
        );

        // const hasRate2Usd$: Observable<boolean> = rate2Usd$.pipe(
        //     map((rate2Usd: number) => {
        //         return isNaN(rate2Usd);
        //     }),
        // );
        // this.isInFiat$
        // Show something in first or second line
        // this.isInFiat$, this.userInput$

        const sources$ = [
            this.selectedToken$, rate2Usd$, this.isInFiat$, this.userInput$
        ];

        // const sideEffect$ = combineLatest([this.selectedToken$, rate2Usd$]).pipe(
        //     tap((x: [string, number]) => {
        //         const [selectedToken, priceInUsd] = x;
        //
        //         if (isNaN(priceInUsd) || priceInUsd <= 0) {
        //             this.exchangeRateIsAvailable = false;
        //             this.baseSymbol = '' + selectedToken;
        //             this.secondarySymbol = 'USD';
        //             // switchMap --()-->
        //         } else {
        //             this.exchangeRateIsAvailable = true;
        //             // switchMap --( allow switcher)-->
        //         }
        //     })
        // );

        // const calculatedAmount$ = combineLatest(sources$).pipe(
        //     map((x: [string, boolean, string, number]) => {
        //         const [selectedToken, priceInUsd, userInputIsInFiat, userInput] = x;
        //
        //         // debugger
        //         if (!userInput || (+userInput) < 0) {
        //             this.baseAmount = 0;
        //             return 0;
        //         }
        //
        //         if (userInputIsInFiat) {
        //             this.baseSymbol = 'USD';
        //             this.secondarySymbol = selectedToken;
        //             return +((1 / (+priceInUsd)) * (+userInput)).toFixed(4);
        //         } else {
        //             this.baseSymbol = '' + selectedToken;
        //             this.secondarySymbol = 'USD';
        //             return +((+priceInUsd) * (+userInput)).toFixed(2);
        //         }
        //     }),
        // );

        // this.subscription = calculatedAmount$.subscribe((calculatedSum: number) => {
        //     this.calculatedSum = calculatedSum;
        // });
    }

    // reset2crypto() {
    //     this.exchangeRateIsAvailable = false;
    //     this.baseSymbol = '' + selectedToken;
    //     this.secondarySymbol = 'USD';
    // }

    // Build on top of selectedToken
    // buildUsdPricePipeLine(selectedToken: string, bnb2fiatRate$, marketRates$): Observable<number> {
    //     // Simple case for BNB
    //     if (selectedToken === "BNB") {
    //         debugger
    //         return bnb2fiatRate$;
    //     }
    //
    //     // Complicated case for tokens
    //     return combineLatest([marketRates$, bnb2fiatRate$]).pipe(
    //         map((x: [IMarketRates[], number]) => {
    //             const [tokenRates, bnb2usd] = x;
    //             const ticker = tokenRates.find(o => o.baseAssetName === selectedToken);
    //             if (!ticker) {
    //                 return NaN;
    //             }
    //
    //             const lastPrice = +(ticker && ticker.lastPrice) || 0;
    //             return (+lastPrice) * bnb2usd;
    //         })
    //     );
    // }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    writeValue(value: number): void {
        this.value = value ? +value : 0;
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
        // if (this.exchangeRateIsAvailable) {
        //     const newMode = !this.isInFiat$.value;
        //     this.isInFiat$.next(!newMode);
        // }
    }
}
