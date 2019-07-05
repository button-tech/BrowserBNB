import {Component, OnInit} from '@angular/core';
import {MemoryService} from "../services/memory.service";
import {BinanceCrypto} from '../services/binance.service';
import {Router} from "@angular/router";
import {StorageService} from "../services/storage.service";
import {AlertsService} from "../services/alerts.service";

@Component({
    selector: 'app-register-repeat-password',
    templateUrl: './register-repeat-password.component.html',
    styleUrls: ['./register-repeat-password.component.css']
})
export class RegisterRepeatPasswordComponent implements OnInit {

    constructor(private memory: MemoryService, private alert: AlertsService, private router: Router, private storage: StorageService) {

    }

    ngOnInit() {
    }

    checkPassword() {
        let password = (<HTMLInputElement>document.getElementById('password')).value;
        let newHash = BinanceCrypto.returnSHA3hashSum(password);
        if (newHash === this.memory.getCurrentPasswordHash()) {
            this.storage.set$(JSON.stringify(this.memory.getCurrentKeystore()));
            this.router.navigate(['/main']);
            return true;
        }
        else {
            this.alert.showError('Passwords do not match', 'Error');
            return false;
        }
    }


}
