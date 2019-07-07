// src/app/auth/auth-guard.service.ts
import {Injectable, OnDestroy} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {AuthService} from './auth.service';
import {StorageService} from './storage.service';

@Injectable()
export class AuthGuardService implements CanActivate, OnDestroy {

    private hasAccount;
    private subscription;

    constructor(private auth: AuthService, private storageService: StorageService, private router: Router) {

        this.subscription = this.storageService.hasAccount$.subscribe((x) => {
            this.hasAccount = x;
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    canActivate(): boolean {

        if (!this.hasAccount) {
            this.router.navigate(['/greeter']);
            return;
        }

        if (!this.auth.isAuthenticated()) {
            this.router.navigate(['/unlock']);
            return false;
        }

        return true;
    }
}
