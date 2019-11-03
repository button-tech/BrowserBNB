import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {StorageService} from '../../services/storage.service';
import {AuthService} from '../../services/auth.service';
import {AlertsService} from '../../services/alerts.service';
import {LocalStorageService} from "../../services/local-storage.service";


@Component({
    selector: 'app-unlock',
    templateUrl: './unlock.component.html',
    styleUrls: ['./unlock.component.css']
})
export class UnlockComponent {
    keystore: any;

    constructor(public localStorageService: LocalStorageService,
                private authService: AuthService,
                private router: Router,
                private storage: StorageService,
                public alert: AlertsService,
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

    onKeydown(event) {
        if (event.key === "Enter") {
            this.unlock();
        }
    }

    navigateToApproval(operation: string) {
        this.router.navigate([`/approve/${operation}`]);
    }
}
