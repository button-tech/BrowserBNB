import {Component, OnInit} from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import {map, shareReplay, switchMap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-history-component',
    templateUrl: './history-component.component.html',
    styleUrls: ['./history-component.component.css']
})
export class HistoryComponentComponent implements OnInit {

    hist$: Observable<any>;

    constructor(private http: HttpClient) {

        const rawHistory$ = timer(0, 60000).pipe(
            switchMap(() => {

                return this.http.get('https://dex.binance.org/api/v1/transactions?address=bnb1hgm0p7khfk85zpz5v0j8wnej3a90w709vhkdfu&startTime=1555707600000');
            })
        );

        this.hist$ = rawHistory$.pipe(
            map((x: any) => {
                return x;
            })
        )

        this.hist$.subscribe()

    }

    ngOnInit() {
    }
}
