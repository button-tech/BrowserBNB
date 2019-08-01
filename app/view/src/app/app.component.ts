import {Component} from '@angular/core';
import {AuthService} from './services/auth.service';
import {StorageService} from './services/storage.service';
import {map, tap} from 'rxjs/operators';
import {combineLatest, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {ChromeApiService} from "./services/chrome-api.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'bnbbrowser';

    subscription: Subscription;

    constructor(private router: Router, authService: AuthService, private chrome: ChromeApiService) {

        // const redirect$ = combineLatest([storageService.hasAccount$, authService.isLoggedIn$]).pipe(
        //     tap((x) => {
        //         const [hasAccount, isLoggedIn] = x;
        //
        //         if (hasAccount && isLoggedIn) {
        //             this.router.navigate(['/main']);
        //         } else if (hasAccount && !isLoggedIn) {
        //             this.router.navigate(['/unlock']);
        //         } else {
        //             this.router.navigate(['/greeter']);
        //         }
        //     })
        // );
        //
        // this.subscription = redirect$.subscribe();
    }

}

