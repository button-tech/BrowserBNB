import {Injectable} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {map, startWith, take} from 'rxjs/operators';
import {StorageService} from './storage.service';
import {getSHA3hashSum} from './binance-crypto';
import {StateService} from './state.service';

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

    // subscription: Subscription;

    constructor(private storage: StorageService, private stateService: StateService) {
        this.isLoggedIn$ = this.subject$.asObservable().pipe(
            startWith(this.isLoggedIn)
        );
    }

    login(password: string): Observable<boolean> {
        const x$ = this.storage.storageData$
            .pipe(
                take(1),
                map((data) => {
                    const x = data.PassHash == getSHA3hashSum(password);
                    if (x) {
                        this.isLoggedIn = true;
                        this.stateService.setPassword(password);
                    }
                    return x;
                })
            );

        x$.subscribe();
        return x$;
    }

    logout(): void {
        this.isLoggedIn = false;
        this.stateService.setPassword('');
    }
}
