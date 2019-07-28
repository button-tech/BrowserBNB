import {Component, OnInit} from '@angular/core';
import {Observable, of, timer} from 'rxjs';
import {map, pluck, shareReplay, switchMap, switchMapTo, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-history-component',
    templateUrl: './history-component.component.html',
    styleUrls: ['./history-component.component.css']
})
export class HistoryComponentComponent {

    history$: Observable<any>;

    constructor(private http: HttpClient) {

        const address = 'bnb1hgm0p7khfk85zpz5v0j8wnej3a90w709vhkdfu';
        const startTime = '1555707600000';
        const hardcodedUrl = `https://dex.binance.org/api/v1/transactions?address=${address}&startTime=${startTime}`;

        this.history$ = timer(0, 60000).pipe(
            switchMapTo(this.http.get(hardcodedUrl)),
            pluck('tx'),
            // TODO: share replay and so on
        );
    }
}
