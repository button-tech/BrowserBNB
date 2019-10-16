import {Component, OnDestroy} from '@angular/core';
import {validateAddress} from '../../../services/binance-crypto';
import {Observable, Subscription, timer} from 'rxjs';
import {StateService} from "../../../services/state.service";
import {Router} from "@angular/router";
import {map} from "rxjs/operators";

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


        //
        // this.stateService.bnb2fiatRate$.pipe(
        //     map((rate: number) => {
        //         if (rawCoin && rawCoin === 'BNB') {
        //             newTx.mapppedName = 'BNB';
        //             newTx.name = 'Binance coin';
        //             newTx.Symbol = 'BNB';
        //             newTx.rate2fiat = rate;
        //         } else {
        //             const coin = JSON.parse(rawCoin);
        //             newTx.mapppedName = coin.mappedName;
        //             newTx.name = coin.name;
        //             newTx.Symbol = coin.symbol;
        //             newTx.rate2fiat = coin.rate2usd;
        //         }
        //
        //         this.stateService.currentTransaction.next(newTx);
        //     })
        // );
    }

    goBack() {
        this.router.navigate(['/main']);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    //
    // Memo input
    //
    // save(memo: string): void {
    //     const nexTx = this.stateService.currentTransaction.getValue();
    //     nexTx.Memo = memo;
    //     this.stateService.currentTransaction.next(nexTx);
    // }

}

