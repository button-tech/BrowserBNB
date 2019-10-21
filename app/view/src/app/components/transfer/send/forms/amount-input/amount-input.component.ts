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
import {BehaviorSubject, combineLatest, Observable, Subscription} from "rxjs";
import {map, tap} from "rxjs/operators";
import {StateService} from "../../../../../services/state.service";

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
    rate2usd: number;

    currentState$: Observable<IAmounts>;
    currentState: IAmounts;

    userInput$: BehaviorSubject<number> = new BehaviorSubject(0);
    doSwap$: BehaviorSubject<boolean> = new BehaviorSubject(false);
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

        // const rate2fiat$ = stateService.bnb2fiatRate$.pipe(
        //     map((rate: number) => {
        //         if (rawCoin && rawCoin === 'BNB') {
        //             newTx.mappedName = 'BNB';
        //             newTx.name = 'Binance coin';
        //             newTx.Symbol = 'BNB';
        //             newTx.rate2fiat = rate;
        //         } else {
        //             const coin = JSON.parse(rawCoin);
        //             newTx.mappedName = coin.mappedName;
        //             newTx.name = coin.name;
        //             newTx.Symbol = coin.symbol;
        //             newTx.rate2fiat = coin.rate2usd;
        //         }
        //     })
        // );

        // this.stateService.bnb2fiatRate$


        const sources$ = [this.selectedToken$, stateService.bnb2fiatRate$, this.doSwap$, this.userInput$];
        this.subscription = combineLatest(sources$).pipe(
            tap((x) => {
                const [selectedToken, bnb2fiatRate, doSwap, userInput] = x;

                console.log(selectedToken);

                if (!userInput || (+userInput) < 0) {
                    this.baseAmount = 0;
                }

                const totalSumInTokenIfNotBNB = sumInCrypto + ' ' + tx.mappedName + ' and ' + fee.toString() + ' BNB';
                const totalSumInTokenIfBNB = Number(sumInCrypto) + Number(fee);

                // TODO: fix
                this.rate2usd = 0.5; // ???

                // let calculatedSum = 0;
                if (doSwap) {
                    this.baseSymbol = doSwap ? 'USD' : '' + selectedToken;
                    this.secondarySymbol = doSwap ? '' + selectedToken : 'USD';
                    this.calculatedSum = +((1 / this.rate2usd) * (+userInput)).toFixed(4);


                } else {
                    this.baseSymbol = '' + selectedToken;
                    this.secondarySymbol = 'USD';
                    this.calculatedSum = +(this.rate2usd * (+userInput)).toFixed(2);

                    // const sumInCrypto = !inUSD ? userInput : userInput / bnb2fiatRate;
                    // const sumInFiat = !inUSD ? (userInput * rate) : userInput;
                }
            }),
        ).subscribe(() => {
            // next - amount
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges): void {
        const value = changes.selectedToken.currentValue;
        this.selectedToken$.next(value);
    }

}
