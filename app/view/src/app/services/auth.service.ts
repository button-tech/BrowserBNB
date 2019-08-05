import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, startWith, switchMap, switchMapTo } from 'rxjs/operators';
import { IStorageData, StorageService } from './storage.service';
import { StateService } from './state.service';
import { Router } from '@angular/router';
import { ChromeApiService } from "./chrome-api.service";


@Injectable()
export class AuthService {

    private subject$ = new Subject<boolean>();
    private _isLoggedIn = false;

    get isLoggedIn(): boolean {
        return this._isLoggedIn;
    }

    set isLoggedIn(value: boolean) {
        this._isLoggedIn = value;
        this.subject$.next(value);
    }

    public isLoggedIn$: Observable<boolean>;

    // subscription: Subscription;

    constructor(private storage: StorageService,
                private router: Router,
                private stateService: StateService,
                private chromeApiService: ChromeApiService) {


        this.isLoggedIn$ = this.subject$.asObservable().pipe(
            startWith(this.isLoggedIn)
        );

        console.log('try to restorePassword');
        this.chromeApiService.restorePassword().pipe(
            switchMap((password: string) => {
                return password ? this.login(password) : of(false);
            }),
        ).subscribe((isLoggedIn: boolean) => {
            if (isLoggedIn) {
                this.router.navigate(['/main']);
            }
        });
    }

    login(password: string): Observable<boolean> {

        console.log('login with', password);

        return this.storage.getFromStorage(password).pipe(
            map((data: IStorageData) => {
                this.isLoggedIn = true;
                this.stateService.initState(data, password);
                this.chromeApiService.savePassword(password);
                return true;
            }),
            catchError((error) => {
                return of(false);
            })
        );
    }


    logout(): void {
        this.chromeApiService.dropPassword();
        this.isLoggedIn = false;
        this.router.navigate(['/unlock']).then(() => {
            this.stateService.resetState();
        });
    }
}
