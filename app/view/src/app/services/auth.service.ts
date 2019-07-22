import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {map, startWith, take} from 'rxjs/operators';
import {StorageService} from './storage.service';
import {getSHA3hashSum} from './binance-crypto';

@Injectable()
export class AuthService {

    private subject$ = new Subject<boolean>();
    private _isLoggedIn: boolean = false;

    get isLoggedIn(): boolean {
        return this._isLoggedIn;
    }

    set isLoggedIn(value: boolean) {
        this._isLoggedIn = value;
        this.subject$.next(value);
    }

    public isLoggedIn$: Observable<boolean>;

    constructor(private storage: StorageService) {
        this.isLoggedIn$ = this.subject$.asObservable().pipe(
            startWith(this.isLoggedIn)
        );
    }

    login(password: string): Observable<boolean> {
        const x$ = this.storage.storageData$
            .pipe(
                take(1),
                map((data) => {
                    return data.PassHash == getSHA3hashSum(password);
                })
            );

        x$.subscribe((x) => {
            if (x) {
                this.isLoggedIn = true;
            }
        });

        return x$;
    }

    logout(): void {
        this.isLoggedIn = false;
    }
}
