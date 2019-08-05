import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {StorageService} from '../../services/storage.service';
import {AuthService} from '../../services/auth.service';
import {AlertsService} from '../../services/alerts.service';
import {ChromeApiService} from "../../services/chrome-api.service";
import {BinanceService} from "../../services/binance.service";

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
                private chrome: ChromeApiService,
                private binance: BinanceService
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
        this.storage.reset();
        this.router.navigate(['/greeter']);
    }

    ngOnInit(): void {
        this.chrome.connectToBackground();
    }
}
