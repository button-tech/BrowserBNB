import {Component, OnInit} from '@angular/core';

import {MemoryService} from "../services/memory.service";
import {ToastrManager} from "ng6-toastr-notifications";
import {Router} from "@angular/router";
import {BinanceCrypto} from "../services/binance.service";

@Component({
    selector: 'app-create',
    templateUrl: './register-mnemonic.component.html',
    styleUrls: ['./register-mnemonic.component.css']
})
export class RegisterMnemonicComponent implements OnInit {

    mnemonic: string;
    marked = false;
    theCheckbox = false;

    constructor(private memory: MemoryService, public toastr: ToastrManager, private router: Router) {
        let fromMemory = this.memory.getCurrentMnemonic();
        if (fromMemory !== 'default' && BinanceCrypto.validateMnemonic(fromMemory)) {
            this.mnemonic = fromMemory;
        } else {
            this.mnemonic = BinanceCrypto.createMnemonic();
            let privateKey = BinanceCrypto.returnPrivateKeyFromMnemonic(this.mnemonic);
            this.memory.setCurrentKey(privateKey);
            this.memory.setCurrentAddress(BinanceCrypto.returnAddressFromPrivateKey(privateKey));
            this.memory.setCurrenMnemonic(this.mnemonic)
        }
    }

    ngOnInit() {
    }

    check() {
        if (this.theCheckbox) {
            this.router.navigate(['/password']);
        }
        else {
            this.showError()
        }
    }

    toggleVisibility(e) {
        this.marked = e.target.checked;
    }


    showError() {
        this.toastr.errorToastr("Please, confirm that you have copied mnemonic", 'Error', {
            position: 'top-full-width',
            maxShown: 1,
            showCloseButton: true,
            toastTimeout: 5000
        });
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
    }

}

