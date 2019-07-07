import {Component} from '@angular/core';
import {AuthService} from './services/auth.service';
import {StorageService} from './services/storage.service';
import {map, tap} from 'rxjs/operators';
import {combineLatest} from 'rxjs';
import {Router} from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'bnbbrowser';

    // constructor(private router: Router, authService: AuthService, storageService: StorageService) {
    //
    //     const hasAccount$ = storageService.storageData$.pipe(
    //         map((x) => x.hasAccount)
    //     );
    //
    //     combineLatest([hasAccount$, authService.isAuthenticated$]).pipe(
    //         tap((x) => {
    //             const [hasAccount, isAuthenticated] = x;
    //
    //             if (hasAccount && isAuthenticated) {
    //                 this.router.navigate(['/main']);
    //             } else if (hasAccount && !isAuthenticated) {
    //                 this.router.navigate(['/unlock']);
    //             } else {
    //                 this.router.navigate(['/greeter']);
    //             }
    //         })
    //     );
    // }

}

