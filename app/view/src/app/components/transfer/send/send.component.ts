import {Component, OnDestroy} from '@angular/core';
import {validateAddress} from '../../../services/binance-crypto';
import {Observable, Subscription, timer} from 'rxjs';
import {StateService} from "../../../services/state.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-send',
    templateUrl: './send.component.html',
    styleUrls: ['./send.component.css']
})
export class SendComponent implements OnDestroy {

    isValidToNextPage: boolean;
    fee: Observable<number>;
    subscription: Subscription;

    constructor(private router: Router, private stateService: StateService) {
        this.subscription = timer(0, 500).subscribe(() => {
            const {Symbol, Amount, AddressTo} = this.stateService.currentTransaction.getValue();
            const networkPrefix = this.stateService.selectedNetwork$.getValue().networkPrefix;
            this.isValidToNextPage = Symbol && Amount > 0 && validateAddress(AddressTo, networkPrefix);
        });
    }

    goBack() {
        this.router.navigate(['/main']);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}

