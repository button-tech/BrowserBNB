import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ITransaction, StateService} from "../../../../../services/state.service";
import {Observable, of} from "rxjs";
import {map} from "rxjs/operators";

interface IAmounts {
    baseSymbol: string;
    secondarySymbol: string;
    secondaryName: string;
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
    currentState$: Observable<IAmounts>;
    isSwapped: boolean;
    isNotAllowed: boolean;

    // @ts-ignore
    @ViewChild('sum') rawSum: ElementRef;

    constructor( private stateService: StateService ) {

        this.stateService.currentTransaction.subscribe(( x: ITransaction ) => {
            let rate2usd = x.rate2usd;
            let secondaryName = 'USD';
            if (x.Symbol === 'BNB') {
                this.stateService.bnb2usdRate$.subscribe(( r ) => {
                    rate2usd = r;
                });
            } else {
                rate2usd = x.rate2usd;
            }
            if (x.rate2usd === 0) {
                secondaryName = '';
                this.isNotAllowed = true;
            } else {
                secondaryName = 'USD';
                this.isNotAllowed = false;
            }
            const symbol =
                x.Symbol.length >= 7 ? x.Symbol.substring(0, 4) + '...' : x.Symbol;
            this.currentState$ = of({
                'baseSymbol': symbol,
                'secondaryName': secondaryName,
                'secondarySymbol': '',
                'calculatedSum': 0,
                'rate2usd': rate2usd
            });
        });
    }


    calcSums() {
        const sum = +((this.rawSum.nativeElement as HTMLInputElement).value);
        if (!this.isSwapped) {
            console.log(1);
            this.currentState$ = this.currentState$.pipe(
                map(( am: IAmounts ) => {
                    const newAm = {
                        'baseSymbol': am.baseSymbol,
                        'secondaryName': am.secondaryName,
                        'secondarySymbol': '',
                        'calculatedSum': +(am.rate2usd * sum).toFixed(2),
                        'rate2usd': am.rate2usd
                    };
                    return newAm;
                })
            );
        } else {
            console.log(2);
            this.currentState$ = this.currentState$.pipe(
                map(( am: IAmounts ) => {
                    const newAm = {
                        'baseSymbol': am.secondaryName,
                        'secondaryName': am.baseSymbol,
                        'secondarySymbol': '',
                        'calculatedSum': +(1 / (am.rate2usd * sum)).toFixed(2),
                        'rate2usd': am.rate2usd
                    };
                    return newAm;
                })
            );
        }
        const newTx = this.stateService.currentTransaction.getValue();
        newTx.Amount = sum;
        this.stateService.currentTransaction.next(newTx);
    }

    swapCurrencies() {

        if (!this.isNotAllowed) {
            this.isSwapped = !this.isSwapped;
        }
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

}
