/// <reference types="chrome"/>
import {Component} from '@angular/core';
import {catchError, map, switchMap} from 'rxjs/operators';
import {BehaviorSubject, combineLatest, Observable, of, Subscription, timer} from 'rxjs';
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
  timer$: Subscription;
  demo: string;

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

    this.timer$ = timer(0, 10000).pipe(
      map((x) => {
        this.getBalance$('bnb1hgm0p7khfk85zpz5v0j8wnej3a90w709vhkdfu', 'https://dex.binance.org/');
        return x;
      })
    ).subscribe();

  }

  getBalance$(address: string, endpoint: string) {
    // return this.http.get(`${https://dex.binance.org/}api/v1/account/${bnb1hgm0p7khfk85zpz5v0j8wnej3a90w709vhkdfu}`).pipe(
    //   map((response: IGetBalanceResponse) => {
    //     return response.balances;
    //   }),
    //   catchError((error: HttpErrorResponse) => {
    //     // TODO: properly handle binance 404 response
    //     // const errResp:  AccountInfo;
    //     return of([]);
    //   })
    // );
    //
    fetch(`${endpoint}api/v1/account/${address}`).then(
      (resp) => {
        // @ts-ignore
        this.example.next(resp.json());
        console.error(resp.json());
      });
  }

}
