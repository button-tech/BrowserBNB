import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ITransaction, StateService} from "../../../../../services/state.service";
import {combineLatest, Observable, of} from "rxjs";
import {map, switchMap} from "rxjs/operators";

interface ICurrency {
    symbol: string;
    name: string;
}

@Component({
    selector: 'app-amount-input',
    templateUrl: './amount-input.component.html',
    styleUrls: ['./amount-input.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AmountInputComponent implements OnInit, OnDestroy {

    emailFormControl = new FormControl('', []);
    baseSymbol: Observable<string>;
    secondarySymbol: Observable<string>;
    calculatedSum: Observable<number>;
    secondaryName: Observable<string>;
    rate2usd: Observable<number>;
    isSwapped: boolean;

    // @ts-ignore
    @ViewChild('sum') rawSum: ElementRef;

    constructor(private stateService: StateService) {
        this.stateService.currentTransaction.subscribe((x: ITransaction) => {
            this.baseSymbol = of(x.Symbol);
            this.secondaryName = of('USD');
            this.secondarySymbol = of('');
            this.calculatedSum = of(0);
            if (x.Symbol === 'BNB') {
                this.rate2usd = this.stateService.bnb2usdRate$;
            } else {
                this.rate2usd = of(x.rate2usd);
            }
        })
    }


    calcSums() {
        if (!this.isSwapped) {
            this.stateService.currentTransaction.subscribe((x: ITransaction) => {
                this.calculatedSum = this.rate2usd.pipe(
                    map((rate: number) => {
                        const sum = +((this.rawSum.nativeElement as HTMLInputElement).value);
                        return rate * sum;
                    }),
                    map((sum: number) => {
                        return +sum.toFixed(2)
                    })
                )
            })
        } else {
            this.stateService.currentTransaction.subscribe((x: ITransaction) => {
                this.calculatedSum = this.rate2usd.pipe(
                    map((rate: number) => {
                        const sum = +((this.rawSum.nativeElement as HTMLInputElement).value);
                        return 1 / rate * sum;
                    }),
                    map((sum: number) => {
                        return +sum.toFixed(2)
                    })
                )
            })
        }

    }

    swapCurrencies() {
        this.isSwapped = !this.isSwapped;
        const temp = this.baseSymbol;
        this.baseSymbol = this.secondaryName;
        this.secondaryName = temp;
    }

    beautifyName(name: Observable<string>): Observable<string> {
        return name.pipe(map((x: string) => {
            return x.substring(0, 7);
        }))
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

}
