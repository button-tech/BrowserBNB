import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {RegistrationService} from '../../services/registration.service';
import {AlertsService} from '../../services/alerts.service';
import {isValidMnemonic} from '../../services/binance-crypto';

@Component({
    selector: 'app-import-mnemonic',
    templateUrl: './import-mnemonic.component.html',
    styleUrls: ['./import-mnemonic.component.css']
})
export class ImportMnemonicComponent {

    constructor(private regSvc: RegistrationService, private router: Router, private alert: AlertsService) {
    }

    next() {
        const mnemonic = (document.getElementById('mnemonic') as HTMLInputElement).value;
        if (!isValidMnemonic(mnemonic)) {
            this.alert.showError('Enter a correct mnemonic to continue', 'Error');
            return;
        }

        this.regSvc.mnemonic = mnemonic;
        this.router.navigate(['/registration/password', {imported: true}]);
    }
}
