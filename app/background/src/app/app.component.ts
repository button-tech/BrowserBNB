/// <reference types="chrome"/>
import {Component} from '@angular/core';
import {catchError, map, switchMap} from 'rxjs/operators';
import {BehaviorSubject, combineLatest, Observable, of, timer} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

export interface IBalance {
  free: string;
  frozen: string;
  locked: string;
  symbol: string;
}

export interface IGetBalanceResponse {
  account_number: number;
  address: string;
  balances: IBalance[];
  public_key: number[];
  sequence: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'background';
  example = new BehaviorSubject('init');
  timer$: Observable<any>;

  constructor() {

    chrome.runtime.onConnect.addListener(function (port) {
      port.postMessage({connected: true});
    });

    chrome.runtime.onMessage.addListener(
      (request, sender, sendResponse) => {
        const resp = this.example.getValue();
        sendResponse(resp);
      }
    );

    this.timer$ = timer(0, 1000);
    combineLatest([this.timer$, this.getBalance$('bnb1hgm0p7khfk85zpz5v0j8wnej3a90w709vhkdfu', 'https://dex.binance.org/')])
      .pipe(
        switchMap((x: any[]) => {
          const [bal] = x;
          // this.example.next(bal);
          return x;
        })
      ).subscribe();

  }

  getBalance$(address: string, endpoint: string): Observable<IBalance[]> {
    // return this.http.get(`${endpoint}api/v1/account/${address}`).pipe(
    //   map((response: IGetBalanceResponse) => {
    //     return response.balances;
    //   }),
    //   catchError((error: HttpErrorResponse) => {
    //     // TODO: properly handle binance 404 response
    //     // const errResp:  AccountInfo;
    //     return of([]);
    //   })
    // );
    return of([]);
  }


}
