import {Component, OnInit} from '@angular/core';
import {Observable, timer} from "rxjs";
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
        const f = timer(0, 60000).pipe(
            switchMap(() => {
                return this.http.get('https://dex.binance.org/api/v1/transactions?address=bnb1hgm0p7khfk85zpz5v0j8wnej3a90w709vhkdfu&startTime=1555707600000');
            })
        );

        this.hist$ = f.pipe(
            map((resp: any) => {
                let group = [];
                console.log(resp);
                (resp.tx).forEach((x) => {
                    group.push(
                        {"sum": x.value, "coin": x.txAsset, "address": x.toAddr, "type": x.txType}
                    );
                });
                return group;
            }),
            map((resp: any) => {
                let group = [];
                (resp).forEach((x) => {
                    let sum, coin, address, type: string;
                    if (x.sum === null) {
                        sum = '';
                        x.sum = ''
                    } else {
                        sum = 'sum '
                    }
                    if (x.coin === null) {
                        coin = '';
                        x.coin = ''
                    } else {
                        coin = 'coin '
                    }
                    if (x.address === null) {
                        address = '';
                        x.address = ''
                    }
                    {
                        address = 'address '
                    }
                    if (x.type === null) {
                        type = '';
                        x.type = ''
                    }
                    {
                        type = 'type '
                    }
                    group.push(
                        {
                            "sum": sum + x.sum,
                            "coin": coin + x.coin,
                            "address": address + x.address,
                            "type": type + x.type
                        }
                    );
                });
                return group;
            }), shareReplay(1)
        )
    }

    ngOnInit() {
    }
}
