import {Component, OnInit} from '@angular/core';
import {MemoryService} from '../services/memory.service';
import {Router} from '@angular/router';
import {StorageService} from '../services/storage.service';
import {AlertsService} from '../services/alerts.service';
import {getSHA3hashSum} from '../services/binance-crypto';

@Component({
    selector: 'app-register-repeat-password',
    templateUrl: './register-repeat-password.component.html',
    styleUrls: ['./register-repeat-password.component.css']
})
export class RegisterRepeatPasswordComponent {

    constructor(private memory: MemoryService, private alert: AlertsService, private router: Router, private storage: StorageService) {
    }

    checkPassword() {
        const password = (document.getElementById('password') as HTMLInputElement).value;
        const newHash = getSHA3hashSum(password);

        if (newHash !== this.memory.getCurrentPasswordHash()) {
            this.alert.showError('Passwords do not match', 'Error');
            return false;
        }

        this.storage.set$(JSON.stringify(this.memory.getCurrentKeystore()));
        this.router.navigate(['/main']);
        return true;
    }
}
