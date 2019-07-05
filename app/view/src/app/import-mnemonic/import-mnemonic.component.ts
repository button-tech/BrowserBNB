import {Component, OnInit} from '@angular/core';
import {MemoryService} from "../services/memory.service";
import {Router} from "@angular/router";
import {Toastr, ToastrManager} from "ng6-toastr-notifications";
import {BinanceService, BinanceCrypto} from "../services/binance.service";
import {AlertsService} from "../services/alerts.service";

@Component({
    selector: 'app-import-mnemonic',
    templateUrl: './import-mnemonic.component.html',
    styleUrls: ['./import-mnemonic.component.css']
})
export class ImportMnemonicComponent implements OnInit {


    constructor(private memory: MemoryService, private router: Router, private alert: AlertsService) {
    }

    ngOnInit() {
    }

    validate() {
        let mnemonic = (<HTMLInputElement>document.getElementById('mnemonic')).value;
        if (BinanceCrypto.validateMnemonic(mnemonic)) {
            let privateKey = BinanceCrypto.returnPrivateKeyFromMnemonic(mnemonic);
            this.memory.setCurrentKey(privateKey);
            this.memory.setCurrentAddress(BinanceCrypto.returnAddressFromPrivateKey(privateKey));
            // this.router.navigate(['/password']);
            this.router.navigate(['/password', {imported: true}]);
        }
        else {
            this.alert.showError('Enter a correct mnemonic to continue', 'Error');
        }
    }
}
