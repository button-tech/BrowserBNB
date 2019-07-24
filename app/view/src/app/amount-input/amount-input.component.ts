import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl} from '@angular/forms';

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
    }
    currentSecondaryCurrency = {
        "symbol": "$",
        "name": "USD"
    }

    sum: number;
    currentSum: number;


    constructor() {
    }

    swapCurrencies() {
        let cache = this.currentBaseCurrency;
        this.currentBaseCurrency = this.currentSecondaryCurrency;
        this.currentSecondaryCurrency = cache;
        this.currentSum = this.getCurrencyRates(this.currentBaseCurrency.name, this.currentSecondaryCurrency.name);
        this.calcSums();
    }

    getCurrencyRates(base, secondary: string): number {
        if (base === 'BNB') {
            return 28;
        }
        else {
            return 1 / 28;
        }
    }
    calcSums() {
        const sum = (((document.getElementById('sum') as HTMLInputElement).value) as unknown as number);
        this.currentSum = this.getCurrencyRates(this.currentBaseCurrency.name, this.currentSecondaryCurrency.name) * sum;
    }

    ngOnInit() {
        this.calcSums();
    }

    emailFormControl = new FormControl('', []);

}
