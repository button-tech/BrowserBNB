import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ITransaction, StateService} from "../../../../../services/state.service";
import {BehaviorSubject, combineLatest, Observable, of} from "rxjs";
import {map, shareReplay, switchMap} from "rxjs/operators";

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

    currentState$: Observable<IAmounts>;

    userInput$: BehaviorSubject<number> = new BehaviorSubject(0);
    swapCurrencies$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    // @ts-ignore
    @ViewChild('sum')
    inputElement: ElementRef;

    constructor(private stateService: StateService) {
    }

    nextValue() {
        const value = this.inputElement.nativeElement.value;
        this.userInput$.next(value);

        const newTx = this.stateService.currentTransaction.getValue();
        newTx.Amount = value;
        this.stateService.currentTransaction.next(newTx);
    }

    swapCurrencies() {
        const doSwap = this.swapCurrencies$.getValue();
        return this.swapCurrencies$.next(!doSwap);
    }

    ngOnInit() {
        const selectedToken$ = this.stateService.currentTransaction.pipe(
            switchMap((x: ITransaction) => {
                if (x.Symbol === '') {
                    x.Symbol = 'BNB';
                }
                if (x.Symbol === 'BNB') {
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
    }

    ngOnDestroy() {
    }
}
