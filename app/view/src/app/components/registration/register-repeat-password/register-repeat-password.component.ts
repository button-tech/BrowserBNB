import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AlertsService} from '../../../services/alerts.service';
import {AuthService} from '../../../services/auth.service';
import {RegistrationService} from '../../../services/registration.service';

@Component({
    selector: 'app-register-repeat-password',
    templateUrl: './register-repeat-password.component.html',
    styleUrls: ['./register-repeat-password.component.css']
})
export class RegisterRepeatPasswordComponent {

    constructor(private authService: AuthService, private regSvc: RegistrationService, private alert: AlertsService, private router: Router) {
    }

    async next() {
        const passwordRepeat = (document.getElementById('password') as HTMLInputElement).value;

        this.regSvc.finishRegistration(passwordRepeat).then(() => {
            this.authService.login(passwordRepeat);
            this.router.navigate(['/main']);
        }, () => {
            this.alert.showError('Passwords do not match', 'Error');
        });
    }
}
