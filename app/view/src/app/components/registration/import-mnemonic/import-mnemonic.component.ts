import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrationService } from '../../../services/registration.service';
import { AlertsService } from '../../../services/alerts.service';
import { isValidMnemonic } from '../../../services/binance-crypto';
import { StateService } from "../../../services/state.service";

@Component({
    selector: 'app-import-mnemonic',
    templateUrl: './import-mnemonic.component.html',
    styleUrls: ['./import-mnemonic.component.css']
})
export class ImportMnemonicComponent {

    // @ts-ignore
    @ViewChild('mnemonic')
    mnemonic: ElementRef;

    private importSingleKey: boolean;

    constructor(private stateService: StateService,
                private regSvc: RegistrationService,
                private router: Router,
                private alert: AlertsService,
                private route: ActivatedRoute
    ) {
        this.importSingleKey = !!this.route.snapshot.queryParamMap.get('importSingleKey');
    }

    next() {
        const mnemonic = this.mnemonic.nativeElement.value;
        if (!isValidMnemonic(mnemonic)) {
            this.alert.showError('Enter a correct mnemonic to continue', 'Error');
            return;
        }

        if (this.importSingleKey) {
            this.stateService.addAccountFromSeed(mnemonic, 0);
            this.router.navigate(['/main']);
            return;
        }

        this.regSvc.mnemonic = mnemonic;
        this.router.navigate(['/registration/password', {imported: true}]);
    }
}
