import {Component, OnInit} from '@angular/core';
import {MemoryService} from "../services/memory.service";
import {BinanceCrypto} from '../services/binance.service';
import {ToastrManager} from 'ng6-toastr-notifications';
import {Router} from "@angular/router";
import {StorageService} from "../services/storage.service";

@Component({
    selector: 'app-register-repeat-password',
    templateUrl: './register-repeat-password.component.html',
    styleUrls: ['./register-repeat-password.component.css']
})
export class RegisterRepeatPasswordComponent implements OnInit {

    constructor(private memory: MemoryService, public toastr: ToastrManager, private router: Router, private storage: StorageService) {

    }

    ngOnInit() {
    }

    showError() {
        this.toastr.errorToastr("Passwords don't match", 'Error', {
            position: 'top-full-width',
            maxShown: 1,
            showCloseButton: true,
            toastTimeout: 5000
        });
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
            this.showError();
            return false;
        }
    }


}
