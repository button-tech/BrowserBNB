// src/app/auth/auth.service.ts
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class AuthService {

    private s$ = new Subject<boolean>();
    private isLoggedIn: boolean = false;
    public isAuthenticated$: Observable<boolean>;

    constructor() {
        this.isAuthenticated$ = this.s$.asObservable();
        this.isAuthenticated$.subscribe((x) => {
            this.isLoggedIn = x;
        });
    }

    login(password: string): void {
        // TODO: password check
        this.s$.next(true);
    }

    logout(): void {
        this.s$.next(false);
    }


    public isAuthenticated(): boolean {
        return this.isLoggedIn;
    }
}
