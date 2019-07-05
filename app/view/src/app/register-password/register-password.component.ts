import {Component, OnInit} from '@angular/core';
import {MemoryService} from '../services/memory.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BinanceCrypto} from '../services/binance.service';
import {ToastrManager} from "ng6-toastr-notifications";

@Component({
    selector: 'app-password-creation',
    templateUrl: './register-password.component.html',
    styleUrls: ['./register-password.component.css']
})
export class RegisterPasswordComponent implements OnInit {
    constructor(private memory: MemoryService, private route: ActivatedRoute, public toastr: ToastrManager, private router: Router) {
    }

    goBack() {
        const params = this.route.snapshot.params;
        const path = params.imported ? '/import' : 'create';
        this.router.navigate([path]);
    }

    ngOnInit() {
    }

    setKeystore() {
        const password = (document.getElementById('password') as HTMLInputElement).value;
        if (password.length === 0) {
            this.showError();
        } else {
            const key = this.memory.getCurrentKey();
            this.router.navigate(['/repeat']);
            const keystore = JSON.stringify(BinanceCrypto.returnKeystoreFromPrivateKey(password, key));
            this.memory.setCurrentKeystore(keystore);
            this.memory.setPasswordHash(BinanceCrypto.returnSHA3hashSum(password));
        }
    }

    showError() {
        this.toastr.errorToastr("Password must be more than 0 letters", 'Error', {
            position: 'top-full-width',
            maxShown: 1,
            showCloseButton: true,
            toastTimeout: 5000
        });
    }
}
