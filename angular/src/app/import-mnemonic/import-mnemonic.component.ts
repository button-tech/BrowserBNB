import {Component, OnInit} from '@angular/core';
import * as Binance from '../../assets/binance/bnbSDK.js'
import {MemoryService} from "../services/memory.service";
import {Router} from "@angular/router";
import {Toastr, ToastrManager} from "ng6-toastr-notifications";

@Component({
    selector: 'app-import-mnemonic',
    templateUrl: './import-mnemonic.component.html',
    styleUrls: ['./import-mnemonic.component.css']
})
export class ImportMnemonicComponent implements OnInit {

    constructor(private memory: MemoryService, private router: Router, public toastr: ToastrManager) {
    }

    ngOnInit() {
    }

    validate() {
        let mnemonic = (<HTMLInputElement>document.getElementById('mnemonic')).value;
        if (Binance.valMnemonic(mnemonic)) {
            let privateKey = Binance.getPvtKeyFromMnemonic(mnemonic);
            this.memory.setCurrentKey(privateKey);
            this.memory.setCurrentAddress(Binance.getAddressFromPrivateKey(privateKey));
            this.router.navigate(['/password']);
        }
        else {
            this.showError();
        }
    }

    showError() {
        this.toastr.errorToastr("Enter a correct mnemonic to continue", 'Error', {position: 'top-full-width', maxShown: 1, showCloseButton: true, toastTimeout: 5000});
    }

}
