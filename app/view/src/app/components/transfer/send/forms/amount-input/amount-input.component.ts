import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { StorageService } from '../../../../../services/storage.service';
import { Subscription, timer } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

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

    // TODO: for tokens and fiat
    fiatList = [
        {
            'symbol': '$',
            'name': 'USD'
        }
    ];

    cryptoList = [
        {
            'symbol': '',
            'name': 'BNB'
        }
    ];

    currentBaseCurrency = {
        'symbol': '',
        'name': 'BNB'
    };

    currentSecondaryCurrency = {
        'symbol': '$',
        'name': 'USD'
    };

    emailFormControl = new FormControl('', []);

    currentSum: number;
    currentSumsecondary: number;
    isSwapped: boolean;
    rate = 0;

    subscription: Subscription;

    constructor(private storage: StorageService, private http: HttpClient) {
        // TODO get rates from state service
        this.subscription = timer(0, 60000).pipe(
            switchMap(() => {
                return this.http.get('https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=USD');
            }),
            tap((resp: any) => {
                this.rate = resp.USD;
            }),
        ).subscribe();
    }

    swapCurrencies() {
        this.isSwapped = !this.isSwapped;
        const tmp = this.currentBaseCurrency;
        this.currentBaseCurrency = this.currentSecondaryCurrency;
        this.currentSecondaryCurrency = tmp;
        this.calcSums();
    }


    getCurrencyRates(base, secondary: string): number {
        if (base === 'BNB') {
            return this.rate;
        } else {
            return 1 / this.rate;
        }
    }

    save() {
        const sum = Number(((document.getElementById('sum') as HTMLInputElement).value) as unknown as string);
        if (!this.isSwapped) {
            this.currentSum = Number(sum.toFixed(8));
        } else if (this.isSwapped) {
            this.currentSum = Number((this.getCurrencyRates(this.currentBaseCurrency.name, this.currentSecondaryCurrency.name) * sum).toFixed(8));
        }

        // this.storage.currentTransaction.Amount = this.currentSum;
    }

    calcSums() {
        if (this.isSwapped) {
            const sum = Number(((document.getElementById('sum') as HTMLInputElement).value) as unknown as string);
            this.currentSumsecondary = Number((this.getCurrencyRates(this.currentBaseCurrency.name, this.currentSecondaryCurrency.name) * sum).toFixed(8));
        } else if (!this.isSwapped) {
            const sum = Number(((document.getElementById('sum') as HTMLInputElement).value) as unknown as string);
            this.currentSumsecondary = Number((this.getCurrencyRates(this.currentBaseCurrency.name, this.currentSecondaryCurrency.name) * sum).toFixed(2));
        }


    }

    ngOnInit() {
        this.calcSums();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}
