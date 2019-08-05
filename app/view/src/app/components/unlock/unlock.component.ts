import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {StorageService} from '../../services/storage.service';
import {ToastrManager} from 'ng6-toastr-notifications';
import {AuthService} from '../../services/auth.service';
import {AlertsService} from '../../services/alerts.service';
import {StateService} from '../../services/state.service';
import {ChromeApiService} from "../../services/chrome-api.service";
import { interval, of } from "rxjs";
import { switchMap, switchMapTo, timeout } from "rxjs/operators";

@Component({
    selector: 'app-unlock',
    templateUrl: './unlock.component.html',
    styleUrls: ['./unlock.component.css']
})
export class UnlockComponent implements OnInit {
    keystore: any;

    constructor(private authService: AuthService,
                private router: Router,
                private storage: StorageService,
                public alert: AlertsService,
                private chrome: ChromeApiService
    ) {


        // message

        const password = '';
        const login$ = of(1);
        const ping$ = of(1);

        const TIMEOUT = 10 * 1000; // 10 sec
        const z$ = ping$.pipe(
            timeout(TIMEOUT)
        );

        login$.pipe(
            switchMapTo(z$)
        );

        // const seconds = interval(1000);
        //
        // seconds.pipe(timeout(1100))      // Let's use bigger timespan to be safe,
        //     // since `interval` might fire a bit later then scheduled.
        //     .subscribe(
        //         value => console.log(value), // Will emit numbers just as regular `interval` would.
        //         err => console.log(err),     // Will never be called.
        //     );
        //
        // seconds.pipe(timeout(900))
        //     .subscribe(
        //         value => console.log(value), // Will never be called.
        //         err => console.log(err),     // Will emit error before even first value is emitted,
        //         // since it did not arrive within 900ms period.
        //     );
    }

    unlock() {
        const password = (document.getElementById('password') as HTMLInputElement).value;
        this.authService.login(password)
            .subscribe((x) => {
                if (!x) {
                    this.alert.showError('Password is incorrect', 'Error');
                } else {
                    this.router.navigate(['/main']);
                }
            });
    }

    reset() {
        // TODO: investigate more on that
        // this.storage.reset().then(() => {
        //     this.router.navigate(['/greeter']);
        // });
        this.storage.reset();
        this.router.navigate(['/greeter']);
    }

    ngOnInit(): void {
        // this.chrome.connectToBackground();
    }
}
