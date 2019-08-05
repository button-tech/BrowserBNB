import {Component} from '@angular/core';
import {BinanceService} from '../../../services/binance.service';
import {StorageService} from '../../../services/storage.service';
import {Observable} from 'rxjs';
import {Location} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {LoadersCSS} from 'ngx-loaders-css';
import {StateService, ITokenInfo} from "../../../services/state.service";

@Component({
    selector: 'app-all-balances',
    templateUrl: './all-balances.component.html',
    styleUrls: ['./all-balances.component.css'],
})
export class AllBalancesComponent {
    tokens$: Observable<ITokenInfo[]>;
    loader: LoadersCSS = 'line-scale';
    bgColor = 'white';
    color = 'rgb(239, 184, 11) ';

    constructor(private bncService: BinanceService,
                private storage: StorageService,
                private location: Location,
                private http: HttpClient,
                private stateService: StateService) {
        this.tokens$ = this.stateService.tokens$;
    }

    goBack() {
        this.location.back();
    }

    makeItShort(st: string) {
        if (st.length > 28) {
            return st.substring(0, 25) + '...';
        }
        return st;

    }
}
