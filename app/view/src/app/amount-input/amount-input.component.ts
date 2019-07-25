import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl} from '@angular/forms';
import {StorageService} from "../services/storage.service";

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


    constructor(private storage: StorageService) {
    }

    swapCurrencies() {
        let cache = this.currentBaseCurrency;
        this.currentBaseCurrency = this.currentSecondaryCurrency;
        this.currentSecondaryCurrency = cache;
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

    save() {

        this.storage.currentTransaction.Amount =  this.currentSum;
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
