import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ITransaction, StateService} from "../../../../../services/state.service";
import {BehaviorSubject, combineLatest, Observable, of, Subscription} from "rxjs";
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
    currentStateSnapshot: IAmounts;

    userInput$: BehaviorSubject<number> = new BehaviorSubject(0);
    swapCurrencies$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    swapped = false;

    // @ts-ignore
    @ViewChild('sum')
    inputElement: ElementRef;

    subscription: Subscription;

    constructor(private stateService: StateService) {
    }

    nextValue() {
        const value = this.inputElement.nativeElement.value;
        this.userInput$.next(value);

        const newTx = this.stateService.currentTransaction.getValue();
        newTx.Amount = this.inputElement.nativeElement.value;
        newTx.IsAmountEnteredInUSD = this.swapCurrencies$.getValue();
        this.stateService.currentTransaction.next(newTx);
        console.warn(newTx);
    }

    swapCurrencies() {
        const doSwap = this.swapCurrencies$.getValue();
        this.swapCurrencies$.next(!doSwap);
        this.nextValue();
    }

    ngOnInit() {
        const selectedToken$ = this.stateService.currentTransaction.pipe(
          switchMap((x: ITransaction) => {
              if (x.Symbol === '') {
                  x.Symbol = 'BNB';
              }

              if (x.Symbol === 'BNB') {
                  return this.stateService.bnb2fiatRate$.pipe(
                    map((rate2fiat) => {
                        return {
                            ...x,
                            rate2fiat
                        };
                    })
                  );
              }
              return of(x);
          }),
          map((x: ITransaction) => {
              const secondarySymbol = x.rate2fiat === 0
                ? ''
                : this.stateService.uiState$.getValue().storageData.baseFiatCurrency;

              return {
                  'baseSymbol': x.Symbol,
                  'secondarySymbol': secondarySymbol,
                  'calculatedSum': 0,
                  'rate2usd': x.rate2fiat
              };
          })
        );

        const z$ = combineLatest([selectedToken$, this.swapCurrencies$]).pipe(
          map((x) => {
              const [selectedToken, doSwap] = x;
              const {baseSymbol, secondarySymbol} = selectedToken;
              // debugger
              return {
                  ...selectedToken,
                  baseSymbol: doSwap ? secondarySymbol : baseSymbol,
                  secondarySymbol: doSwap ? baseSymbol : secondarySymbol,
                  doSwap
              };
          })
        );

        this.currentState$ = combineLatest([z$, this.userInput$]).pipe(
          map((x) => {
              const [selectedToken, amount] = x;

              let calculatedSum = 0;
              if (selectedToken.doSwap) {
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

        this.subscription = this.currentState$.subscribe( (currentState: IAmounts) => {
            this.currentStateSnapshot = currentState;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
