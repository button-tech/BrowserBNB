import {Component, OnDestroy} from '@angular/core';
import {merge, Observable, of, Subscription} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {LoadersCSS} from 'ngx-loaders-css';
import {IHistoryTx} from '../../../services/binance.service';
import {StateService} from '../../../services/state.service';
import {tokenDetailsList} from "../../../constants";
import {BlockchainType} from "../../../services/storage.service";

@Component({
    selector: 'app-history-component',
    templateUrl: './history-component.component.html',
    styleUrls: ['./history-component.component.css']
})
export class HistoryComponentComponent implements OnDestroy {

    loader: LoadersCSS = 'line-scale';
    bgColor = 'white';
    color = 'rgb(239, 184, 11)'; // rgb(80, 100, 251)

    isLoaded = false;
    history: IHistoryTx[] = [];
    private subscription: Subscription;
    public isEmpty: boolean;

    constructor(private stateService: StateService, private router: Router) {

        const isCosmos = stateService.selectedBlockchain$.pipe(
            tap((blockchain: BlockchainType) => {
                this.color = blockchain === 'cosmos'
                    ? "rgb(80, 100, 251)"
                    : "rgb(239, 184, 11)";
            })
        );

        const history$ = this.stateService.history$.pipe(
            tap((history: IHistoryTx[]) => {
                this.history = history;
                this.isEmpty = !this.history.length;
                this.isLoaded = true;
            })
        );

        const loadingIndicator$ = this.stateService.showHistoryLoadingIndicator$.pipe(
            tap((x) => {
                this.isLoaded = !x;
            })
        );

        this.subscription = merge(isCosmos, history$, loadingIndicator$).subscribe();
    }

    checkType(tx: IHistoryTx): string {
        if (tx.txType.toLocaleLowerCase() === "transfer") {
            if (tx.fromAddr === this.stateService.currentAddress) {
                return tx.txType.replace('_', ' ');
            } else {
                return 'RECEIVED';
            }
        }
        return tx.txType.replace('_', ' ');
    }

    findMappedName(symbol: string): string {
        if (symbol) {
            const result = tokenDetailsList.find(o => o.symbol === symbol);
            return result && result.mappedAsset ? result.mappedAsset : symbol;
        }
        return symbol;
    }

    findMappedImage(symbol: string): string {
        const defaultImg = '../../../../assets/icons/default.png';
        if (!symbol) {
            return defaultImg;
        }

        const result = tokenDetailsList.find(o => o.symbol === symbol);
        return (result && result.image) || defaultImg;
    }

    calculateSumInFiat(amount: number): Observable<string> {
        return this.stateService.bnb2fiatRate$.pipe(
            map((rate: number) => {
                return (amount * rate).toFixed(2);
            })
        );
    }

    goToDetails(tx: any) {
        this.stateService.historyDetails$ = of(tx);
        this.router.navigate(['/details']);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
