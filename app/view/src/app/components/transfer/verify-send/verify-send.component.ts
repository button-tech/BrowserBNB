import {Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, combineLatest, from, Observable} from 'rxjs';
import {BinanceService} from '../../../services/binance.service';
import {map, shareReplay, switchMap, take} from 'rxjs/operators';
import {ITransaction, StateService} from '../../../services/state.service';
import {Router} from "@angular/router";

interface ITransactionDetails {
    IsBnb: boolean;
    SumInCrypto: string;
    SumInCryptoRaw: number;
    CryptoName: string;
    SumInFiat: string;
    FeeInBNB: string;
    FeeInFiat: string;
    TotalSumInToken: string;
    TotalSumInFiat: string;
}

const basicTransactionState: ITransaction = {
    Amount: 0,
    IsAmountEnteredInUSD: false,
    AddressTo: '',
    AddressFrom: '',
    Memo: '',
    Symbol: 'BNB',
    name: 'Binance Coin',
    mappedName: 'BNB',
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
        const txSnapshot = this.stateService.currentTransaction.getValue();
        this.tx.next(txSnapshot);

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
                const inUSD = tx.IsAmountEnteredInUSD;
                const sumInCrypto = !inUSD ? tx.Amount : tx.Amount / rate;
                const sumInFiat = !inUSD ? (tx.Amount * rate) : tx.Amount;

                const totalSumInTokenIfNotBNB = sumInCrypto + ' ' + tx.mappedName + ' and ' + fee.toString() + ' BNB';
                const totalSumInTokenIfBNB = Number(sumInCrypto) + Number(fee);

                const isBnb = tx.Symbol === 'BNB';
                const totalSumInToken = isBnb
                    ? totalSumInTokenIfBNB.toString()
                    : totalSumInTokenIfNotBNB;

                const TotalFiatSum = +sumInFiat + (Number(fee) * Number(rate));
                const txDetails: ITransactionDetails = {
                    IsBnb: isBnb,
                    CryptoName: isBnb ? 'BNB' : tx.mappedName,
                    SumInCrypto: (+sumInCrypto).toFixed(4),
                    SumInCryptoRaw: sumInCrypto,
                    SumInFiat: (+sumInFiat).toFixed(2),

                    FeeInBNB: fee.toString(),
                    FeeInFiat: (Number(fee) * Number(rate)).toFixed(2),

                    TotalSumInToken: (+totalSumInToken).toFixed(4),
                    TotalSumInFiat: TotalFiatSum.toFixed(2),
                };
                return txDetails;
            }),
            shareReplay(1)
        );
    }

    verify() {

        this.txDetails.pipe(
            take(1),
            switchMap((txDetails: ITransactionDetails) => {
                const tx = this.tx.getValue();
                const network = this.stateService.selectedNetwork$.getValue();
                const privateKey = this.stateService.uiState.currentAccount.privateKey;


                const p$ = this.bncService.sendTransaction(
                    +txDetails.SumInCrypto,
                    tx.AddressTo,
                    network.label,
                    network.val,
                    network.networkPrefix,
                    tx.Symbol,
                    privateKey,
                    tx.Memo
                );

                return from(p$);
            })
        ).subscribe((result) => {
            console.log(result);
        });

    }

    ngOnDestroy() {
        this.stateService.currentTransaction.next({
            Amount: 0,
            IsAmountEnteredInUSD: false,
            AddressTo: '',
            AddressFrom: '',
            Memo: '',
            Symbol: '',
            name: '',
            mappedName: '',
            rate2fiat: 0,
        });
    }
}
