import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';


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

export interface IHistoryTx {
  txHash: string;
  blockHeight: number;
  txType: string;
  timeStamp: Date;
  fromAddr: string;
  toAddr: string;
  value: string;
  txAsset: string;
  txFee: string;
  txAge: number;
  orderId: string;
  code: number;
  data: string;
  confirmBlocks: number;
  memo: string;
}

export interface IGetHistoryResponse {
  tx: IHistoryTx[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class BinanceService {

  constructor(private http: HttpClient) {
  }

  getBalance$(address: string, endpoint: string): Observable<IBalance[]> {
    return this.http.get(`${endpoint}api/v1/account/${address}`).pipe(
      map((response: IGetBalanceResponse) => {
        return response.balances;
      }),
      catchError((error: HttpErrorResponse) => {
        // TODO: properly handle binance 404 response
        // const errResp:  AccountInfo;
        return of([]);
      })
    );
  }

  getHistory$(address: string, endpoint: string): Observable<IHistoryTx[]> {
    const unix_time = +Date.now();
    const ninety_days_in_seconds = (86400 * 90) * 1000;
    const startTime = unix_time - ninety_days_in_seconds;

    return this.http.get(`${endpoint}api/v1/transactions?address=${address}&startTime=${startTime}`)
      .pipe(
        map((response: IGetHistoryResponse) => {
          return response.tx;
        }),
        catchError((error: HttpErrorResponse) => {
          // TODO: properly handle binance 404 response
          return of([]);
        })
      );
  }
}
