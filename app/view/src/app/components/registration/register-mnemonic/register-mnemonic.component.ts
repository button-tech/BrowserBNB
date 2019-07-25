import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RegistrationService} from '../../../services/registration.service';
import {AlertsService} from '../../../services/alerts.service';
import {ClipboardService} from '../../../services/clipboard.service';


@Component({
    selector: 'app-create',
    templateUrl: './register-mnemonic.component.html',
    styleUrls: ['./register-mnemonic.component.css']
})
export class RegisterMnemonicComponent implements OnInit {

    mnemonic: string;
    theCheckbox = false;
    copyMessage = 'Copy mnemonic';

    constructor(private regSvc: RegistrationService, private alert: AlertsService, private router: Router,
                private clipboardService: ClipboardService) {
    }

    ngOnInit(): void {
        this.mnemonic = (this.regSvc.hasMnemonic && this.regSvc.mnemonic) || this.regSvc.generateMnemonic();
    }

    next() {
        if (!this.theCheckbox) {
            this.alert.showError('Please, confirm that you have copied mnemonic', 'Error');
            return;
        }

        this.router.navigate(['/registration/password']);
    }

    copyMnemonicToClipboard() {
        this.clipboardService.copyToClipboard(this.mnemonic);
        this.copyMessage = 'Copied';
    }
}

