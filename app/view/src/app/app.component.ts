import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { StorageService } from './services/storage.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { combineLatest, of, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ChromeApiService } from "./services/chrome-api.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    subscription: Subscription;
    isLoaded: boolean = false;

    constructor(private router: Router,
                private authService: AuthService,
                private chromeApiService: ChromeApiService,
                private storageService: StorageService
    ) {

        console.log('AppComponent: try to restorePassword');

        this.subscription = this.storageService.hasAccountOnce$().pipe(
          switchMap((hasAccount: boolean) => {
              if (!hasAccount)
                  return of('/greeter');

              return this.chromeApiService.restorePassword().pipe(
                switchMap((password) => {
                    if (!password) {
                        return of('/unlock');
                    }

                    return this.authService.login(password).pipe(
                      map((isLoggedIn: boolean) => {
                          return isLoggedIn ? '/main' : '/unlock';
                      })
                    )
                })
              )
          })
        ).subscribe((route) => {
            this.isLoaded = true;
            this.router.navigate([route]);
        });
    }

}

