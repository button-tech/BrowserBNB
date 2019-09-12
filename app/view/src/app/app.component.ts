import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { StorageService } from './services/storage.service';
import { map, switchMap } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ChromeApiService } from "./services/chrome-api.service";
import { LoadersCSS } from "ngx-loaders-css";
import { environment } from "../environments/environment.prod";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    loader: LoadersCSS = 'line-scale';
    bgColor = 'white';
    color = 'rgb(239, 184, 11) ';
    isLoaded = false;

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private authService: AuthService,
                private chromeApiService: ChromeApiService,
                private storageService: StorageService
    ) {

        console.log('AppComponent: try to restorePassword');

        this.storageService.hasAccountOnce$().pipe(
          switchMap((hasAccount: boolean) => {
              if (!hasAccount) {
                  return of('/greeter');
              }

              console.log('1');
              return this.chromeApiService.restorePassword().pipe(
                switchMap((password) => {
                    if (!password) {
                        return of('/unlock');
                    }

                    return this.authService.login(password).pipe(
                      map((isLoggedIn: boolean) => {
                          return isLoggedIn ? '/main' : '/unlock';
                      })
                    );
                })
              );
          })
        ).subscribe((route) => {
            this.isLoaded = true;
            this.router.navigate([route]);
        });

        // if (!environment.production) {
        //
        //     this.storageService.hasAccountOnce$().pipe(
        //         switchMap((hasAccount: boolean) => {
        //             if (!hasAccount) {
        //                 return of('/greeter');
        //             }
        //
        //             return this.chromeApiService.restorePassword().pipe(
        //                 switchMap((password) => {
        //                     if (!password) {
        //                         return of('/unlock');
        //                     }
        //
        //                     return this.authService.login(password).pipe(
        //                         map((isLoggedIn: boolean) => {
        //                             return isLoggedIn ? '/main' : '/unlock';
        //                         })
        //                     );
        //                 })
        //             );
        //         })
        //     ).subscribe((route) => {
        //         this.isLoaded = true;
        //         this.router.navigate([route]);
        //     });
        //
        // } else {
        //     // Work once - no need to unsubscribe
        //     this.storageService.hasAccountOnce$().pipe(
        //         switchMap((hasAccount: boolean) => {
        //             this.isLoaded = true;
        //             return of('/unlock');
        //         })
        //     ).subscribe((route) => {
        //         this.router.navigate([route]);
        //     });
        // }

    }
}

