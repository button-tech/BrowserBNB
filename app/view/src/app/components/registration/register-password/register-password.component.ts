import {Component} from '@angular/core';
import {AlertsService} from '../../../services/alerts.service';
import {RegistrationService} from '../../../services/registration.service';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';


@Component({
    selector: 'app-password-creation',
    templateUrl: './register-password.component.html',
    styleUrls: ['./register-password.component.css']
})
export class RegisterPasswordComponent {
    constructor(private regSvc: RegistrationService, private authService: AuthService, private router: Router, private alert: AlertsService) {
    }

    next() {
        const password = (document.getElementById('password') as HTMLInputElement).value;
        if (!password) {
            this.alert.showError('Password must be more than 0 letters', 'Error');
            return;
        }

        this.regSvc.password = password;
        this.router.navigate(['/registration/repeat']);
        return;
    }
}
