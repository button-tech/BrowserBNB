import {Component, OnInit} from '@angular/core';
import {ITransaction, StorageService} from "../../../services/storage.service";
import {BehaviorSubject, combineLatest, Observable, timer} from "rxjs";
import {BinanceService} from "../../../services/binance.service";
import {map, pluck, shareReplay, switchMap} from "rxjs/operators";
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-verify-send',
    templateUrl: './verify-send.component.html',
    styleUrls: ['./verify-send.component.css']
})
export class VerifySendComponent implements OnInit {

    sendObj: ITransaction;
    simpleFee$: Observable<number>;
    fiatFee$: Observable<string>;
    fiatAmount$: Observable<string>;
    totalAmount$: Observable<number>;
    fiatTotal$: Observable<string>;
    address$: Observable<string>;
    privateKey$: Observable<string>;

    constructor(private storage: StorageService, private bncService: BinanceService, private http: HttpClient) {

        this.address$ = this.storage.currentAccount$.pipe(
            pluck('address')
        );
        this.privateKey$ = this.storage.currentAccount$.pipe(
            pluck('privateKey')
        );
        const timer$ = timer(0, 4000);


        const rawFee$ = combineLatest([this.storage.selectedNetwork$, timer$]).pipe(
            switchMap((x: any[]) => {
                const [networkMenuItem] = x;
                const endpoint = networkMenuItem.val;
                return this.http.get(`${endpoint}api/v1/fees`)
            }),
            shareReplay(1)
        );

        const pluckFee = (response: any) => {
            const item = response.find((x) => x.multi_transfer_fee === 30000);
            return item.fixed_fee_params.fee / 100000000;
        };

        this.simpleFee$ = rawFee$.pipe(
            map((response) => {
                return pluckFee(response)
            }),
            shareReplay(1)
        );

        const bnb2usdRate$ = timer(0, 60000).pipe(
            switchMap(() => {
                return this.http.get('https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=USD');
            }),
            map((resp: any) => resp.USD)
        );

        const rawFiatFee$ = combineLatest([bnb2usdRate$, this.simpleFee$]).pipe(
            map((x: any[]) => {
                const [rate, fee] = x;
                return rate * fee
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
                return fee + this.sendObj.Amount
            })
        );
        this.fiatTotal$ = combineLatest([rawFiatAmount$, rawFiatFee$]).pipe(
            map((x: any[]) => {
                const [amount, fee] = x;
                return (amount + fee).toFixed(2);
            })
        )
    }


    ngOnInit() {
        this.sendObj = this.storage.currentTransaction;
    }


    verify() {
        combineLatest([this.privateKey$, this.storage.selectedNetwork$]).pipe(
            map((x: any[]) => {
                const [privateKey, network] = x;
                return this.bncService.sendTransaction(
                    this.sendObj.Amount,
                    this.sendObj.AddressTo,
                    network.val,
                    network.networkPrefix,
                    this.sendObj.Symbol,
                    privateKey,
                    this.sendObj.Memo)
            })
        ).subscribe((hash: any) => {
            // console.log(hash)
        }).unsubscribe();

    }

}
