import {Injectable} from '@angular/core';
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TemporaryService {
    details$: Observable<any>;

    constructor() {
    }
}
