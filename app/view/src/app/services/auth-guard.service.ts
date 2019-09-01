// src/app/auth/auth-guard.service.ts
import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from './auth.service';
import {StorageService} from './storage.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ChromeApiService} from "./chrome-api.service";

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private auth: AuthService,
                private storageService: StorageService,
                private router: Router,
                private chromeApiService: ChromeApiService) {
    }

    canActivate(): Observable<boolean> {

        // const x$ = combineLatest([
        //     this.chromeApiService.restorePassword(),
        //     this.storageService.hasAccountOnce$()
        // ]);
        //
        //
        // return x$.pipe(
        //   map((x) => {
        //
        //       const [password, hasAccount] = x;
        //
        //       if (!hasAccount) {
        //           this.router.navigate(['/greeter']);
        //           return false;
        //       }
        //
        //       if (!this.auth.isLoggedIn) {
        //           this.router.navigate(['/unlock']);
        //           return false;
        //       }
        //
        //       return true;
        //   })
        // );

        return this.storageService.hasAccountOnce$().pipe(
            map((hasAccount) => {

                if (!hasAccount) {
                    this.router.navigate(['/greeter']);
                    return false;
                }

                if (!this.auth.isLoggedIn) {
                    this.router.navigate(['/unlock']);
                    return false;
                }

                return true;
            })
        );
    }
}
