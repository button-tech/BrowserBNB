import {Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {BinanceService} from '../../../services/binance.service';
import {map, shareReplay} from 'rxjs/operators';
import {ITransaction, StateService} from '../../../services/state.service';
import {Router} from "@angular/router";

interface ITransactionDetails {
    SumInToken: string;
    SumInFiat: string;
    FeeInBNB: string;
    FeeInFiat: string;
    TotalSumInToken: string;
    TotalSumInFiat: string;
}

const basicTransactionState: ITransaction = {
    Amount: 0,
    AddressTo: '',
    AddressFrom: '',
    Memo: '',
    Symbol: 'BNB',
    name: 'Binance Coin',
    mapppedName: 'BNB',
    rate2fiat: 0
};

@Component({
    selector: 'app-verify-send',
    templateUrl: './verify-send.component.html',
    styleUrls: ['./verify-send.component.css']
})
export class VerifySendComponent implements OnDestroy, OnInit {
    tx = new BehaviorSubject<ITransaction>(basicTransactionState);
    iterator = new BehaviorSubject<number>(0);
    txDetails: Observable<ITransactionDetails>;

    constructor(public stateService: StateService,
                private bncService: BinanceService,
                private router: Router) {
    }

    ngOnInit() {
        this.tx.next(this.stateService.currentTransaction.getValue());
        const selectedNetwork$ = this.stateService.selectedNetwork$;

        selectedNetwork$.subscribe(() => {
            const oldVal = this.iterator.getValue();
            if (oldVal > 0) {
                this.iterator.next(0);
                this.router.navigate(['/send']);
            } else {
                this.iterator.next(oldVal + 1);
            }
        });

        const bnb2usdRate$ = this.stateService.bnb2fiatRate$;
        const bnbTransferFee$ = this.stateService.simpleFee$;

        this.txDetails = combineLatest([bnb2usdRate$, bnbTransferFee$]).pipe(
            map((x: any[]) => {
                const [rate, fee] = x;
                const tx = this.tx.getValue();
                const totalSumInTokenIfNotBNB = tx.Amount + ' ' + tx.mapppedName + ' and ' + fee.toString() + ' BNB';
                const totalSumInTokenIfBNB = Number(tx.Amount) + Number(fee);
                const totalSumInToken = tx.Symbol === 'BNB' ? totalSumInTokenIfBNB.toString() : totalSumInTokenIfNotBNB;
                const TotalFiatSum = (Number(fee) * Number(rate) + (tx.Amount * tx.rate2fiat)).toFixed(2);
                const txDetails: ITransactionDetails = {
                    SumInToken: tx.Amount.toString(),
                    SumInFiat: (tx.Amount * tx.rate2fiat).toFixed(2),
                    FeeInBNB: fee.toString(),
                    FeeInFiat: (Number(fee) * Number(rate)).toFixed(2),
                    TotalSumInToken: totalSumInToken,
                    TotalSumInFiat: TotalFiatSum,
                };
                return txDetails;
            }),
            shareReplay(1)
        );
    }

    verify() {
        const tx = this.tx.getValue();
        const network = this.stateService.selectedNetwork$.getValue();
        const privateKey = this.stateService.uiState.currentAccount.privateKey;
        return this.bncService.sendTransaction(
            tx.Amount,
            tx.AddressTo,
            network.label,
            network.val,
            network.networkPrefix,
            tx.Symbol,
            privateKey,
            tx.Memo);
    }

    ngOnDestroy() {
        this.stateService.currentTransaction.next({
            Amount: 0,
            AddressTo: '',
            AddressFrom: '',
            Memo: '',
            Symbol: '',
            name: '',
            mapppedName: '',
            rate2fiat: 0,
        });
    }
}
