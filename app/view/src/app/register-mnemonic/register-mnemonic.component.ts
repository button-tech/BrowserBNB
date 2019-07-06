import {Component, OnInit} from '@angular/core';
import {MemoryService} from '../services/memory.service';
import {Router} from '@angular/router';
import {AlertsService} from '../services/alerts.service';
import {createMnemonic, getPrivateKeyFromMnemonic, isValidMnemonic} from '../services/binance-crypto';
import {getAddressFromPrivateKey} from '../../assets/binance/bnbSDK';

@Component({
    selector: 'app-create',
    templateUrl: './register-mnemonic.component.html',
    styleUrls: ['./register-mnemonic.component.css']
})
export class RegisterMnemonicComponent {

    mnemonic: string;
    theCheckbox = false;
    copyMessage = 'Copy mnemonic';

    constructor(memorySvc: MemoryService, private alert: AlertsService, private router: Router) {

        let mnemonic = memorySvc.getCurrentMnemonic();
        if (mnemonic === 'default mnemonic' || !isValidMnemonic(mnemonic)) {

            // Init new
            mnemonic = createMnemonic();
            const privateKey = getPrivateKeyFromMnemonic(mnemonic);
            const address = getAddressFromPrivateKey(privateKey);

            // TODO: check - maybe we shouldn't override storage, and show some warming in case we get some mnemonic but it isn't valid
            memorySvc.setCurrentKey(privateKey);
            memorySvc.setCurrentAddress(address);
            memorySvc.setCurrenMnemonic(mnemonic);
        }

        this.mnemonic = mnemonic;
    }

    check() {
        if (!this.theCheckbox) {
            this.alert.showError('Please, confirm that you have copied mnemonic', 'Error');
            return;
        }

        this.router.navigate(['/password']);
    }

    copyObj(val: string) {
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

