import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ITransaction, StateService } from "../../../../../services/state.service";
import { BehaviorSubject, combineLatest, Observable, of, Subject, Subscription } from "rxjs";
import { map, shareReplay, switchMap, take } from "rxjs/operators";

interface IAmounts {
    baseSymbol: string;
    secondarySymbol: string;
    calculatedSum: number;
    rate2usd: number;
}

@Component({
    selector: 'app-amount-input',
    templateUrl: './amount-input.component.html',
    styleUrls: ['./amount-input.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AmountInputComponent implements OnInit, OnDestroy {


    emailFormControl = new FormControl('', []);
    // currentState$: Subject<IAmounts> = new Subject();
    currentState$: Observable<IAmounts>;

    userInput$: BehaviorSubject<number> = new BehaviorSubject(0);
    // currencyOfUserInput$: BehaviorSubject<string> = new BehaviorSubject('BNB');
    swapCurrencies$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    currentState = {
        'baseSymbol': '',
        'secondarySymbol': '',
        'calculatedSum': 0,
        'rate2usd': 0
    };

    // @ts-ignore
    @ViewChild('sum')
    inputElement: ElementRef;

    subscription: Subscription;

    constructor(private stateService: StateService) {

        const selectedToken$ = this.stateService.currentTransaction.pipe(
            switchMap((x: ITransaction) => {
                if (x.Symbol === 'BNB') {
                    // return this.stateService.bnb2usdRate$
                    return this.stateService.bnb2usdRate$.pipe(
                        map((rate2usd) => {
                            return {
                                ...x,
                                rate2usd
                            };
                        })
                    );
                }
                return of(x);
            }),
            map((x: ITransaction) => {
                const secondarySymbol = x.rate2usd === 0 ? '' : 'USD';
                // const symbol = x.Symbol.length >= 7 && (x.rate2usd !== 0)
                //     ? x.Symbol.substring(0, 4) + '...'
                //     : x.Symbol;

                return {
                    'baseSymbol': x.Symbol,
                    'secondarySymbol': secondarySymbol,
                    'calculatedSum': 0,
                    'rate2usd': x.rate2usd
                };
            })
        );

        const z$ = combineLatest([selectedToken$, this.swapCurrencies$]).pipe(
            map((x) => {
                const [selectedToken, doSwap] = x;
                const {baseSymbol, secondarySymbol} = selectedToken;

                return {
                    ...selectedToken,
                    baseSymbol: doSwap ? secondarySymbol : baseSymbol,
                    secondarySymbol: doSwap ? baseSymbol : secondarySymbol,
                };
            })
        );

        this.currentState$ = combineLatest([z$, this.userInput$]).pipe(
            map((x) => {
                const [selectedToken, amount] = x;

                let calculatedSum = 0;
                if (selectedToken.baseSymbol === 'USD') {
                    calculatedSum = +((1 / selectedToken.rate2usd) * amount).toFixed(4);
                } else {
                    calculatedSum = +(selectedToken.rate2usd * amount).toFixed(2);
                }

                return {
                    ...selectedToken,
                    calculatedSum,
                    rate2usd: selectedToken.rate2usd
                };
            }),
            shareReplay(1)
        );

        this.subscription = this.currentState$.subscribe((x) => {
            this.currentState = x;
        });
    }


    calcSums() {
        // const sum = +((this.rawSum.nativeElement as HTMLInputElement).value);
        // if (!this.isSwapped) {
        //
        //     // const a = this.currentState$.pipe(..);
        //     // const b = a.pipe(...);
        //     // const c = b.pipe(...);
        //
        //     this.currentState$ = of({
        //         'baseSymbol': am.baseSymbol,
        //         'secondaryName': am.secondaryName,
        //         'secondarySymbol': '',
        //         'calculatedSum': +(am.rate2usd * sum).toFixed(2),
        //         'rate2usd': am.rate2usd
        //     });
        //
        //     this.currentState$ = this.currentState$.pipe(
        //         map((am: IAmounts) => {
        //             console.log(1);
        //             const newAm = {
        //                 'baseSymbol': am.baseSymbol,
        //                 'secondaryName': am.secondaryName,
        //                 'secondarySymbol': '',
        //                 'calculatedSum': +(am.rate2usd * sum).toFixed(2),
        //                 'rate2usd': am.rate2usd
        //             };
        //             return newAm;
        //         })
        //     );
        // } else {
        //
        //     this.currentState$ = this.currentState$.pipe(
        //         map((am: IAmounts) => {
        //             console.log(2);
        //             const newAm = {
        //                 'baseSymbol': am.secondaryName,
        //                 'secondaryName': am.baseSymbol,
        //                 'secondarySymbol': '',
        //                 'calculatedSum': +(1 / (am.rate2usd * sum)).toFixed(2),
        //                 'rate2usd': am.rate2usd
        //             };
        //             return newAm;
        //         })
        //     );
        // }
        // const newTx = this.stateService.currentTransaction.getValue();
        // newTx.Amount = sum;
        // this.stateService.currentTransaction.next(newTx);
    }

    nextValue() {
        const value = this.inputElement.nativeElement.value;
        this.userInput$.next(value);
    }

    swapCurrencies() {

        const doSwap = this.swapCurrencies$.getValue();
        this.swapCurrencies$.next(!doSwap);

        // console.log(this.currentState.baseSymbol);
        //
        // const nextValue = this.currentState.baseSymbol === 'USD'
        //     ? this.currentState.baseSymbol
        //     : 'USD';
        //
        // console.log(nextValue);

        //this.currencyOfUserInput$.next(nextValue);
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
