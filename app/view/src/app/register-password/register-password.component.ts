import {Component, OnInit} from '@angular/core';
import {MemoryService} from '../services/memory.service';
import * as Binance from '../../assets/binance/bnbSDK.js';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-password-creation',
    templateUrl: './register-password.component.html',
    styleUrls: ['./register-password.component.css']
})
export class RegisterPasswordComponent implements OnInit {
    constructor(private memory: MemoryService, private route: ActivatedRoute, private router: Router) {
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
        const key = this.memory.getCurrentKey();
        const keystore = JSON.stringify(Binance.createKeystore(password, key));
        this.memory.setCurrentKeystore(keystore);
        this.memory.setPasswordHash(Binance.sha3(password));
    }

}
