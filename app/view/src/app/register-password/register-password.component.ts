import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertsService} from '../services/alerts.service';
import {RegistrationService} from '../services/registration.service';
import {AuthService} from '../services/auth.service';

@Component({
    selector: 'app-password-creation',
    templateUrl: './register-password.component.html',
    styleUrls: ['./register-password.component.css']
})
export class RegisterPasswordComponent {
    constructor(private regSvc: RegistrationService, private authService: AuthService, private router: Router, private route: ActivatedRoute, private alert: AlertsService) {
    }

    next() {
        const password = (document.getElementById('password') as HTMLInputElement).value;
        if (!password) {
            this.alert.showError('Password must be more than 0 letters', 'Error');
            return;
        }

        this.regSvc.password = password;

        const params = this.route.snapshot.params;
        if (!params.imported) {
            // Create new flow
            this.router.navigate(['/registration/repeat']);
            return;
        }

        // Import flow
        this.regSvc.finishImport(password).then(() => {
            this.authService.login(password);
            this.router.navigate(['/main']);
        });
    }
}
