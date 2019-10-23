import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, shareReplay} from "rxjs/operators";
import {Observable} from 'rxjs';
import {CurrencySymbols} from "../constants";

export interface Rate {
    0x00000000000000000000000000000000000002ca: string;
}

export interface Datum {
    currency: string;
    rates: Rate[];
}

export interface ResponseFromCoursesApi {
    data: Datum[];
}

@Injectable({
    providedIn: 'root'
})
export class CoursesService {

    constructor( private http: HttpClient ) {
    }

    getBinanceRate$( baseCurrency: CurrencySymbols ): Observable<string> {
        const url = 'https://node.buttonwallet.tech/courses/v1/prices';
        const body = {
            "tokens": [
                "0x00000000000000000000000000000000000002ca"
            ],
            "currencies": [
                baseCurrency
            ],
            "change": "0",
            "api": "cmc"
        };

        return this.http.post(url, body).pipe(
            map(( response: ResponseFromCoursesApi ) => {
                return Number((response.data[0].rates[0]["0x00000000000000000000000000000000000002ca"])).toFixed(2);
            }),
            shareReplay(1)
        );
    }
}

