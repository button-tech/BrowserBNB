// src/app/auth/auth-guard.service.ts
import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {AuthService} from './auth.service';
import {StorageService} from './storage.service';
import {Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private auth: AuthService, private storageService: StorageService, private router: Router) {
    }

    canActivate(): Observable<boolean> {
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
