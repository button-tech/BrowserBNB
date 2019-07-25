import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl} from '@angular/forms';
import {StorageService} from "../../../../../services/storage.service";
import {BehaviorSubject, timer} from "rxjs";
import {map, switchMap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";

interface ICurrency {
    symbol: string,
    name: string
}


@Component({
    selector: 'app-amount-input',
    templateUrl: './amount-input.component.html',
    styleUrls: ['./amount-input.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AmountInputComponent implements OnInit {


    fiatList = [
        {
            "symbol": "$",
            "name": "USD"
        }
    ];
    cryptoList = [
        {
            "symbol": "",
            "name": "BNB"
        }
    ];

    currentBaseCurrency = {
        "symbol": "",
        "name": "BNB"
    };
    currentSecondaryCurrency = {
        "symbol": "$",
        "name": "USD"
    };

    currentSum: number;
    currentSumsecondary: number;
    bal: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    swaped: boolean;

    constructor(private storage: StorageService, private http: HttpClient) {
        const bnb2usdRate$ = timer(0, 60000).pipe(
            switchMap(() => {
                return this.http.get('https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=USD');
            }),
            map((resp: any) => this.bal.next(resp.USD)),
        ).subscribe();

    }

    swapCurrencies() {
        this.swaped = !this.swaped;

        let cache = this.currentBaseCurrency;
        this.currentBaseCurrency = this.currentSecondaryCurrency;
        this.currentSecondaryCurrency = cache;
        this.calcSums();
    }


    getCurrencyRates(base, secondary: string): number {
        if (base === 'BNB') {
            return this.bal.getValue();
        }
        else {
            return 1 / this.bal.getValue();
        }
    }

    save() {
        const sum = Number(((document.getElementById('sum') as HTMLInputElement).value) as unknown as string);
        if (!this.swaped) {
            this.currentSum = Number(sum.toFixed(8));
        } else if (this.swaped) {
            this.currentSum = Number((this.getCurrencyRates(this.currentBaseCurrency.name, this.currentSecondaryCurrency.name) * sum).toFixed(8));
        }
        this.storage.currentTransaction.Amount = this.currentSum;
    }

    calcSums() {
        if (this.swaped) {
            const sum = Number(((document.getElementById('sum') as HTMLInputElement).value) as unknown as string);
            this.currentSumsecondary = Number((this.getCurrencyRates(this.currentBaseCurrency.name, this.currentSecondaryCurrency.name) * sum).toFixed(8));
        } else if (!this.swaped) {
            const sum = Number(((document.getElementById('sum') as HTMLInputElement).value) as unknown as string);
            this.currentSumsecondary = Number((this.getCurrencyRates(this.currentBaseCurrency.name, this.currentSecondaryCurrency.name) * sum).toFixed(2));
        }


    }

    ngOnInit() {
        this.calcSums();
    }

    emailFormControl = new FormControl('', []);

}
