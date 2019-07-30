import {Component, OnInit} from '@angular/core';
import {Observable, of, timer} from 'rxjs';
import {map, switchMap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {TemporaryService} from "../../../services/temporary.service";
import {Router} from "@angular/router";
import {rawTokensImg} from '../../../constants';
import {LoadersCSS} from "ngx-loaders-css";

@Component({
    selector: 'app-history-component',
    templateUrl: './history-component.component.html',
    styleUrls: ['./history-component.component.css']
})
export class HistoryComponentComponent implements OnInit {
    loader: LoadersCSS = 'line-scale';
    bgColor = 'white';
    color = 'rgb(239, 184, 11) ';
    hist$: Observable<any>;
    histLen$: Observable<any>;


    constructor(private http: HttpClient, public temp: TemporaryService, private router: Router) {

        const rawHistory$ = timer(0, 60000).pipe(
            switchMap(() => {
                // TODO:  real address and time now - 3 months UNIX
                return this.http.get('https://dex.binance.org/api/v1/transactions?address=bnb1hgm0p7khfk85zpz5v0j8wnej3a90w709vhkdfu&startTime=1555707600000');
            })
        );

        this.hist$ = rawHistory$.pipe(
            map((x: any) => {
                return x.tx;
            })
        );

        this.histLen$ = this.hist$.pipe(
            map((x) => {
                return x.length
            })
        )

        this.histLen$.subscribe();

    }

    ngOnInit() {
    }

    findMappedName(symbol: string): string {
        if (symbol) {
            const result = JSON.parse(rawTokensImg).find(o => o.symbol === symbol);
            return result.mappedAsset;
        }
        return symbol
    }

    findMappedImage(symbol: string): string {
        if (symbol) {
            const result = JSON.parse(rawTokensImg).find(o => o.symbol === symbol);
            if (!result.image) {
                return '../../../../assets/icons/default.png'
            }
            return result.image;
        }
        return '../../../../assets/icons/default.png'
    }

    goToDetails(tx: any) {
        this.temp.details$ = of(tx);
        this.router.navigate(['/details'])
    }

    convert2fiat(sum: string, asset: string): string {
        const value = String((Number(28) * Number(sum)).toFixed(2));
        if (value === '0.00' || asset !== 'BNB') {
            return ''
        }
        return '$' + value;
    }

}
