import {Component, OnInit} from '@angular/core';
import {MemoryService} from '../services/memory.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertsService} from '../services/alerts.service';
import {getKeystoreFromPrivateKey, getSHA3hashSum} from '../services/binance-crypto';

@Component({
    selector: 'app-password-creation',
    templateUrl: './register-password.component.html',
    styleUrls: ['./register-password.component.css']
})
export class RegisterPasswordComponent implements OnInit {
    constructor(private memory: MemoryService, private route: ActivatedRoute, private alert: AlertsService, private router: Router) {
    }

    goBack() {
        const params = this.route.snapshot.params;
        const path = params.imported ? '/import' : 'create';
        this.router.navigate([path]);
    }

    ngOnInit() {
    }

    setKeystore() {
        const password = (document.getElementById('password') as HTMLInputElement).value;
        if (!!password) {
            this.alert.showError('Password must be more than 0 letters', 'Error');
            return;
        }

        const privateKey = this.memory.getCurrentPrivateKey();
        const keystore = getKeystoreFromPrivateKey(privateKey, password);
        const jsonStr = JSON.stringify(keystore);
        this.memory.setCurrentKeystore(jsonStr);
        this.memory.setPasswordHash(getSHA3hashSum(password));

        this.router.navigate(['/repeat']);
    }
}
