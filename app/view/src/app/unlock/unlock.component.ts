import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {StorageService} from "../services/storage.service";
import {MemoryService} from "../services/memory.service";
import {BinanceCrypto} from '../services/binance.service';
import {ToastrManager} from "ng6-toastr-notifications";

@Component({
    selector: 'app-unlock',
    templateUrl: './unlock.component.html',
    styleUrls: ['./unlock.component.css']
})
export class UnlockComponent implements OnInit {
    keystore: string;

    constructor(private router: Router, private memory: MemoryService, private storage: StorageService,public toastr: ToastrManager) {
        this.keystore = JSON.parse(this.memory.getCurrentKeystore());
    }

    ngOnInit() {
    }

    unlock() {
        const password = (document.getElementById('password') as HTMLInputElement).value;

        try {
            const privateKey = BinanceCrypto.returnPrivateKeyFromKeystore(this.keystore, password);
            this.memory.setCurrentKey(privateKey);
            this.memory.setCurrentAddress(BinanceCrypto.returnAddressFromPrivateKey(privateKey));
            this.router.navigate(['/main'])
        }
        catch (e) {
            this.showError();
            this.router.navigate(['/unlock']);
            console.log(e);
        }

    }

    showError() {
        this.toastr.errorToastr("Password is incorrect", 'Error', {
            position: 'top-full-width',
            maxShown: 1,
            showCloseButton: true,
            toastTimeout: 5000
        });
    }

    reset() {
        this.storage.reset();
        this.memory.setCurrentKeystore("");
        this.delay(50).then(()=> {
            this.router.navigate(['/greeter']);
        });


    }

    async delay(ms: number) {
        await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => console.log("fired"));
    }
    
}
