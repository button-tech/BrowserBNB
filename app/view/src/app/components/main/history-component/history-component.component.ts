import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subscription, timer} from 'rxjs';
import {map, startWith, switchMap, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {TemporaryService} from '../../../services/temporary.service';
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
    private isEmpty: boolean;

    constructor(private stateService: StateService, private router: Router, public temp: TemporaryService) {
        this.subscription = this.stateService.history$.pipe(
            tap((history: IHistoryTx[]) => {
                this.history = history;
                this.isEmpty = !this.history.length;
                this.isLoaded = true;
            })
        ).subscribe();
    }

    findMappedName(symbol: string): string {
        if (symbol) {
            const result = JSON.parse(rawTokensImg).find(o => o.symbol === symbol);
            return result && result.mappedAsset;
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
        this.temp.details$ = of(tx);
        this.router.navigate(['/details']);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
