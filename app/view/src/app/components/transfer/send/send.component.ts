import { Component, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { StorageService } from '../../../services/storage.service';
import { validateAddress } from '../../../services/binance-crypto';
import { Observable, Subscription, timer } from 'rxjs';
import {StateService} from "../../../services/state.service";

@Component({
    selector: 'app-send',
    templateUrl: './send.component.html',
    styleUrls: ['./send.component.css']
})
export class SendComponent implements OnDestroy {

    isValidToNextPage: boolean;
    fee: Observable<number>;

    constructor(private location: Location, private stateService: StateService) {
        this.stateService.currentTransaction.subscribe((tx) => {
            const {Symbol, Amount, AddressTo} = tx;
            const networkPrefix = this.stateService.selectedNetwork$.getValue().networkPrefix;
            this.isValidToNextPage = Symbol && Amount > 0 && validateAddress(AddressTo, networkPrefix);
        })
    }

    goBack() {
        this.location.back();
    }

    ngOnDestroy(): void {
    }

}

