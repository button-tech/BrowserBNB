import {Injectable} from '@angular/core';
import {Observable, of, Subject, Subscription} from 'rxjs';
import {catchError, map, startWith, take} from 'rxjs/operators';
import {IStorageData, StorageService} from './storage.service';
import {getSHA3hashSum} from './binance-crypto';
import {StateService} from './state.service';
import {Router} from '@angular/router';

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

    constructor(private storage: StorageService, private router: Router, private stateService: StateService) {
        this.isLoggedIn$ = this.subject$.asObservable().pipe(
            startWith(this.isLoggedIn)
        );
    }

    login(password: string): Observable<boolean> {

        return this.storage.getFromStorage(password).pipe(
            map((data: IStorageData) => {
                this.isLoggedIn = true;
                this.stateService.initState(data, password);
                return true;
            }),
            catchError(() => {
                return of(false);
            })
        );
    }

    logout(): void {
        this.isLoggedIn = false;
        this.router.navigate(['/unlock']).then(() => {
            this.stateService.resetState();
        })
    }
}
