import {Component, OnDestroy} from '@angular/core';
import {validateAddress} from '../../../services/binance-crypto';
import {combineLatest, Observable, Subscription, timer} from 'rxjs';
import {StateService} from "../../../services/state.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-send',
    templateUrl: './send.component.html',
    styleUrls: ['./send.component.css']
})
export class SendComponent implements OnDestroy {

    coin: string;

    isAddressValid: boolean;
    isValidToNextPage: boolean;
    fee: Observable<number>;
    subscription: Subscription;

    constructor(private router: Router, private stateService: StateService) {

        // WTF ???
        // this.subscription = timer(0, 500).subscribe(() => {
        //     const {Symbol, Amount, AddressTo} = this.stateService.currentTransaction.getValue();
        //     const networkPrefix = this.stateService.selectedNetwork$.getValue().networkPrefix;
        //     this.isValidToNextPage = Symbol && Amount > 0 && validateAddress(AddressTo, networkPrefix);
        // });
        //
        const {bnb2fiatRate$, marketRates$} = this.stateService;

        this.subscription = combineLatest([bnb2fiatRate$, marketRates$])
            .pipe(

            ).subscribe();
        // const bnb2fiat = this.stateService.bnb2fiatRate$;
        // const marketRates = this.stateService.marketRates$;
    }

    goBack() {
        this.router.navigate(['/main']);
    }

    // ngOnDestroy(): void {
    //     this.subscription.unsubscribe();
    // }

    //
    // Memo input
    //
    // save(memo: string): void {
    //     const nexTx = this.stateService.currentTransaction.getValue();
    //     nexTx.Memo = memo;
    //     this.stateService.currentTransaction.next(nexTx);
    // }

    validateAddress(addressValue: string) {
        const networkPrefix = this.stateService.selectedNetwork$.getValue().networkPrefix;
        this.isAddressValid = validateAddress(addressValue, networkPrefix);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onCoinSelected(coin: string) {
        console.log(coin);
    }
}

