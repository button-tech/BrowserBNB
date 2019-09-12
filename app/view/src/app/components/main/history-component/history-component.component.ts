import {Component, OnDestroy} from '@angular/core';
import {of, Subscription} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {rawTokensImg} from '../../../constants';
import {LoadersCSS} from 'ngx-loaders-css';
import {IHistoryTx} from '../../../services/binance.service';
import {StateService} from '../../../services/state.service';

@Component({
    selector: 'app-history-component',
    templateUrl: './history-component.component.html',
    styleUrls: ['./history-component.component.css']
})
export class HistoryComponentComponent implements OnDestroy {

    loader: LoadersCSS = 'line-scale';
    bgColor = 'white';
    color = 'rgb(239, 184, 11) ';

    isLoaded = false;
    history: IHistoryTx[] = [];
    private subscription: Subscription;
    public isEmpty: boolean;

    constructor(private stateService: StateService, private router: Router) {

        this.subscription = this.stateService.history$.pipe(
            tap((history: IHistoryTx[]) => {
                this.history = history;
                this.isEmpty = !this.history.length;
                this.isLoaded = true;
            })
        ).subscribe();

        this.stateService.showHistoryLoadingIndicator$.subscribe((x) => {
            this.isLoaded = !x;
        });
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
            const result = JSON.parse(rawTokensImg).find(o => o.symbol === symbol);
            return result && result.mappedAsset ? result.mappedAsset : symbol;
        }
        return symbol;
    }

    findMappedImage(symbol: string): string {
        const defaultImg = '../../../../assets/icons/default.png';
        if (!symbol) {
            return defaultImg;
        }

        const result = JSON.parse(rawTokensImg).find(o => o.symbol === symbol);
        return (result && result.image) || defaultImg;
    }

    goToDetails(tx: any) {
        this.stateService.historyDetails$ = of(tx);
        this.router.navigate(['/details']);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
