import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {StorageService} from '../services/storage.service';
import {MemoryService} from '../services/memory.service';
import {ToastrManager} from 'ng6-toastr-notifications';
import {getAddressFromPrivateKey, getPrivateKeyFromKeystore} from '../services/binance-crypto';

@Component({
    selector: 'app-unlock',
    templateUrl: './unlock.component.html',
    styleUrls: ['./unlock.component.css']
})
export class UnlockComponent implements OnInit {
    keystore: any;

    constructor(private router: Router, private memory: MemoryService, private storage: StorageService, public toastr: ToastrManager) {
        const jsonStr = this.memory.getCurrentKeystore();
        this.keystore = JSON.parse(jsonStr);
    }

    ngOnInit() {
    }

    unlock() {
        const password = (document.getElementById('password') as HTMLInputElement).value;

        try {
            const privateKey = getPrivateKeyFromKeystore(this.keystore, password);
            this.memory.setCurrentKey(privateKey);
            this.memory.setCurrentAddress(getAddressFromPrivateKey(privateKey));
            this.router.navigate(['/main']);
        } catch (e) {
            this.showWrongPasswordMessage();
            this.router.navigate(['/unlock']);
            console.log(e);
        }

    }

    showWrongPasswordMessage() {
        this.toastr.errorToastr('Password is incorrect', 'Error', {
            position: 'top-full-width',
            maxShown: 1,
            showCloseButton: true,
            toastTimeout: 5000
        });
    }

    reset() {
        this.storage.reset(); // TODO: should be awaitable
        this.memory.setCurrentKeystore(''); // TODO: should be awaitable

        // TODO: instead of timeout navigate after `await` on storage setter
        setTimeout(() => {
            this.router.navigate(['/greeter']);
        }, 50);
    }
}
