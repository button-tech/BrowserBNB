import {Component} from '@angular/core';
import {AlertsService} from '../../../services/alerts.service';
import {RegistrationService} from '../../../services/registration.service';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';


@Component({
    selector: 'app-password-creation',
    templateUrl: './password.component.html',
    styleUrls: ['./password.component.css']
})
export class PasswordComponent {
    constructor(private regSvc: RegistrationService,
                private authService: AuthService,
                private router: Router,
                private alert: AlertsService) {
    }

    onKeydown(event) {
        if (event.key === "Enter") {
            this.next();
        }
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
