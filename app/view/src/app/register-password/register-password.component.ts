import {Component, OnInit} from '@angular/core';
import {MemoryService} from '../services/memory.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BinanceCrypto} from '../services/binance.service';
import {AlertsService} from "../services/alerts.service";

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
        if (password.length === 0) {
            this.alert.showError('Password must be more than 0 letters', 'Error');
        } else {
            const key = this.memory.getCurrentKey();
            this.router.navigate(['/repeat']);
            const keystore = JSON.stringify(BinanceCrypto.returnKeystoreFromPrivateKey(password, key));
            this.memory.setCurrentKeystore(keystore);
            this.memory.setPasswordHash(BinanceCrypto.returnSHA3hashSum(password));
        }
    }
}
