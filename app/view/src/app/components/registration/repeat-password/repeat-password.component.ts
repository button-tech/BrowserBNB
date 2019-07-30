import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsService } from '../../../services/alerts.service';
import { AuthService } from '../../../services/auth.service';
import { RegistrationService } from '../../../services/registration.service';
import { timer } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

@Component({
    selector: 'app-register-repeat-password',
    templateUrl: './register-repeat-password.component.html',
    styleUrls: ['./register-repeat-password.component.css']
})
export class RepeatPasswordComponent {

    constructor(private authService: AuthService,
                private regSvc: RegistrationService,
                private alert: AlertsService,
                private router: Router) {
    }

    next(): void {
        const passwordRepeat = (document.getElementById('password') as HTMLInputElement).value;

        if (!this.regSvc.finishRegistration(passwordRepeat)) {
            this.alert.showError('Passwords do not match', 'Error');
            return;
        }


        // Wait for storage 250 ms, because we faces with an issue after implementing proper async / await sequence
        timer(250).pipe(
            take(1),
            switchMap(() => {
                return this.authService.login(passwordRepeat);
            })
        ).subscribe(
            () => {
                this.router.navigate(['/main']);
            }
        );
    }
}
