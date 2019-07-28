import { Component, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { StorageService } from '../../../services/storage.service';
import { validateAddress } from '../../../services/binance-crypto';
import { Observable, Subscription, timer } from 'rxjs';

@Component({
    selector: 'app-send',
    templateUrl: './send.component.html',
    styleUrls: ['./send.component.css']
})
export class SendComponent implements OnDestroy {

    isValidToNextPage: boolean;
    fee: Observable<number>;
    subscription: Subscription;

    constructor(private location: Location, private storage: StorageService) {

        this.subscription = timer(0, 500)
            .subscribe(() => {
                this.checkForm();
            });
    }


    goBack() {
        this.location.back();
    }

    checkForm(): void {
        // const {Symbol, Amount, AddressTo} = this.storage.currentTransaction;
        // const networkPrefix = this.storage.selectedNetwork$.getValue().networkPrefix;
        // this.isValidToNextPage = Symbol && Amount > 0 && validateAddress(AddressTo, networkPrefix);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }


}

