import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {IStorageData, StorageService} from './storage.service';
import {StateService} from './state.service';
import {Router} from '@angular/router';
import {ChromeApiService} from "./chrome-api.service";

@Injectable()
export class AuthService {

    private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
    public isLoggedIn$: Observable<boolean> = this._isLoggedIn$.asObservable();

    get isLoggedIn(): boolean {
        return this._isLoggedIn$.getValue();
    }

    constructor(private storage: StorageService,
                private router: Router,
                private stateService: StateService,
                private chromeApiService: ChromeApiService) {

        // this.isLoggedIn$.pipe(
        //   switchMap((isLoggedIn) => {
        //       if (isLoggedIn) {
        //           return interval(2500).pipe(map(() => true));
        //       }
        //       return of(false);
        //   }),
        //   filter((x) => x),
        //   tap(() => {
        //       this.chromeApiService.sendKeepAlive();
        //   })
        // ).subscribe();
    }

    login(password: string): Observable<boolean> {

        console.log('login with', password);

        return this.storage.getFromStorage(password).pipe(
          map((data: IStorageData) => {
              console.log('this._isLoggedIn$.next', true);
              this._isLoggedIn$.next(true);
              this.stateService.initState(data, password);
              this.chromeApiService.savePassword(password);
              return true;
          }),
          catchError(() => {
              return of(false);
          })
        );
    }


    logout(): void {
        this.chromeApiService.dropPassword();
        this._isLoggedIn$.next(false);
        this.router.navigate(['/unlock']).then(() => {
            this.stateService.resetState();
        });
    }
}
