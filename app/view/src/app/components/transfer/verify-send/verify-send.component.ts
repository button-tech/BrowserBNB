import {Component, OnInit} from '@angular/core';
import {combineLatest, Observable, timer} from 'rxjs';
import {BinanceService} from '../../../services/binance.service';
import {map, shareReplay, switchMap, take} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {ITransaction, StateService} from '../../../services/state.service';

@Component({
    selector: 'app-verify-send',
    templateUrl: './verify-send.component.html',
    styleUrls: ['./verify-send.component.css']
})
export class VerifySendComponent {

    sendObj: ITransaction;
    simpleFee$: Observable<number>;
    fiatFee$: Observable<string>;
    fiatAmount$: Observable<string>;
    totalAmount$: Observable<number>;
    fiatTotal$: Observable<string>;

    constructor(private stateService: StateService, private bncService: BinanceService, private http: HttpClient) {

        const timer$ = timer(0, 4000);

        const rawFee$ = combineLatest([this.stateService.selectedNetwork$, timer$]).pipe(
            switchMap((x: any[]) => {
                const [networkMenuItem] = x;
                const endpoint = networkMenuItem.val;
                return this.http.get(`${endpoint}api/v1/fees`);
            }),
            shareReplay(1)
        );

        const pluckFee = (response: any) => {
            const item = response.find((x) => x.multi_transfer_fee === 30000);
            return item.fixed_fee_params.fee / 100000000;
        };

        this.simpleFee$ = rawFee$.pipe(
            map((response) => {
                return pluckFee(response);
            }),
            shareReplay(1)
        );

        // TODO: take rates from state service
        const bnb2usdRate$ = timer(0, 60000).pipe(
            switchMap(() => {
                return this.http.get('https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=USD');
            }),
            map((resp: any) => resp.USD)
        );

        const rawFiatFee$ = combineLatest([bnb2usdRate$, this.simpleFee$]).pipe(
            map((x: any[]) => {
                const [rate, fee] = x;
                return rate * fee;
            }), shareReplay(1)
        );

        this.fiatFee$ = rawFiatFee$.pipe(
            map(rate => {
                return rate.toFixed(2);
            })
        );

        const rawFiatAmount$ = bnb2usdRate$.pipe(
            map(rate => {
                return rate * this.sendObj.Amount;
            })
        );

        this.fiatAmount$ = rawFiatAmount$.pipe(
            map(rate => {
                return rate.toFixed(2);
            })
        );

        this.totalAmount$ = this.simpleFee$.pipe(
            map((fee) => {
                return fee + this.sendObj.Amount;
            })
        );
        this.fiatTotal$ = combineLatest([rawFiatAmount$, rawFiatFee$]).pipe(
            map((x: any[]) => {
                const [amount, fee] = x;
                return (amount + fee).toFixed(2);
            })
        );
    }

    verify() {
        // TODO: FIX privateKey
        // const privateKey = '';
        // return this.bncService.sendTransaction(
        //     this.sendObj.Amount,
        //     this.sendObj.AddressTo,
        //     network.val,
        //     network.networkPrefix,
        //     this.sendObj.Symbol,
        //     privateKey,
        //     this.sendObj.Memo);
    }

}
