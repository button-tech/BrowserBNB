import {Component, OnInit} from '@angular/core';
import {MemoryService} from '../services/memory.service';
import {Router} from '@angular/router';
import {AlertsService} from '../services/alerts.service';
import {getAddressFromPrivateKey, getPrivateKeyFromMnemonic, isValidMnemonic} from '../services/binance-crypto';

@Component({
    selector: 'app-import-mnemonic',
    templateUrl: './import-mnemonic.component.html',
    styleUrls: ['./import-mnemonic.component.css']
})
export class ImportMnemonicComponent {

    constructor(private memory: MemoryService, private router: Router, private alert: AlertsService) {
    }

    onContinueClick() {
        const mnemonic = (document.getElementById('mnemonic') as HTMLInputElement).value;
        if (!isValidMnemonic(mnemonic)) {
            this.alert.showError('Enter a correct mnemonic to continue', 'Error');
        }

        let privateKey = getPrivateKeyFromMnemonic(mnemonic);
        this.memory.setCurrentKey(privateKey);
        this.memory.setCurrentAddress(getAddressFromPrivateKey(privateKey));

        this.router.navigate(['/password', {imported: true}]);
    }
}
