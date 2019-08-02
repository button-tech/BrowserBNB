import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StateService, ITokenInfo } from '../../../../../services/state.service';
import { Observable, Subscription } from 'rxjs';
import { map, take } from "rxjs/operators";


@Component({
    selector: 'app-coins-select',
    templateUrl: './coins-select.component.html',
    styleUrls: ['./coins-select.component.css']
})
export class CoinsSelectComponent implements OnInit, OnDestroy {

    bnb$: Observable<number>;
    heroForm: FormGroup;
    tokens$: Observable<ITokenInfo[]>;
    bnb2usdRate$: Observable<number>;

    subscription1: Subscription;
    subscription2: Subscription;

    constructor(private fb: FormBuilder, public stateService: StateService) {

        this.bnb$ = this.stateService.bnbBalance$;
        this.tokens$ = this.stateService.tokens$;
        this.bnb2usdRate$ = this.stateService.bnb2usdRate$;

        this.subscription1 = this.stateService.selectedNetwork$.subscribe(() => {
            this.heroForm = this.fb.group({
                heroId: 'BNB',
                agree: null
            });
            const newTx = this.stateService.currentTransaction.getValue();


            const rate$ = this.stateService.bnb2usdRate$;
            // TODO: subscription3
            rate$.pipe(
                map((rate: number) => {
                    newTx.mapppedName = 'BNB';
                    newTx.name = 'Bianance coin';
                    newTx.Symbol = 'BNB';
                    newTx.rate2usd = rate;
                    this.stateService.currentTransaction.next(newTx);
                })
            ).subscribe();
        });
    }

    selectCoin(rawCoin: any) {
        const newTx = this.stateService.currentTransaction.getValue();

        if (this.subscription2) {
            this.subscription2.unsubscribe();
        }

        this.subscription2 = this.bnb2usdRate$.pipe(
            map((rate: number) => {
                if (rawCoin && rawCoin === 'BNB') {
                    newTx.mapppedName = 'BNB';
                    newTx.name = 'Bianance coin';
                    newTx.Symbol = 'BNB';
                    newTx.rate2usd = rate;
                } else {
                    const coin = JSON.parse(rawCoin);
                    newTx.mapppedName = coin.mappedName;
                    newTx.name = coin.name;
                    newTx.Symbol = coin.symbol;
                    newTx.rate2usd = coin.rate2usd;
                }
                this.stateService.currentTransaction.next(newTx);
            })
        ).subscribe();
    }

    ngOnInit() {
        this.heroForm = this.fb.group({
            heroId: 'BNB',
            agree: null
        });
    }

    ngOnDestroy(): void {
        if (this.subscription1) {
            this.subscription1.unsubscribe();
        }

        if (this.subscription2) {
            this.subscription2.unsubscribe();
        }
    }
}
