import {Component, OnInit} from '@angular/core';
import {createMnemonic, getPrivateKeyFromMnemonic, isValidMnemonic} from '../services/binance-crypto';
import {getAddressFromPrivateKey} from '../../assets/binance/bnbSDK';
import {AccountService} from "../services/account.service";
import {Router} from "@angular/router";
import {AlertsService} from "../services/alerts.service";
import {RegistrationService} from '../services/registration.service';

@Component({
    selector: 'app-create',
    templateUrl: './register-mnemonic.component.html',
    styleUrls: ['./register-mnemonic.component.css']
})
export class RegisterMnemonicComponent implements OnInit {

    mnemonic: string;
    theCheckbox = false;
    copyMessage = 'Copy mnemonic';

    constructor(private regSvc: RegistrationService, private alert: AlertsService, private router: Router) {
    }

    ngOnInit(): void {
        this.mnemonic = (this.regSvc.hasMnemonic && this.regSvc.mnemonic) || this.regSvc.generateMnemonic();
    }

    check() {
        if (!this.theCheckbox) {
            this.alert.showError('Please, confirm that you have copied mnemonic', 'Error');
            return;
        }

        this.router.navigate(['/registration/password']);
    }

    copyToClipboard(val: string) {
        let obj = document.createElement('textarea');
        obj.style.position = 'fixed';
        obj.style.left = '0';
        obj.style.top = '0';
        obj.style.opacity = '0';
        obj.value = val;
        document.body.appendChild(obj);
        obj.focus();
        obj.select();
        document.execCommand('copy');
        document.body.removeChild(obj);

        // Update message
        this.copyMessage = 'Copied';
    }
}

