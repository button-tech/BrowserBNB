import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {StorageService} from '../../services/storage.service';
import {ToastrManager} from 'ng6-toastr-notifications';
import {AuthService} from '../../services/auth.service';
import {AlertsService} from '../../services/alerts.service';
import {StateService} from '../../services/state.service';
import {ChromeApiService} from "../../services/chrome-api.service";

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
        this.chrome.connectToBackground();
    }
}
