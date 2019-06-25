import {Component, OnInit} from '@angular/core';
import {MemoryService} from "../services/memory.service";
import * as Binance from '../../assets/binance/bnbSDK.js'

@Component({
    selector: 'app-password-creation',
    templateUrl: './register-password.component.html',
    styleUrls: ['./register-password.component.css']
})
export class RegisterPasswordComponent implements OnInit {
    
    constructor(private memory: MemoryService) {
    }

    ngOnInit() {

    }

    setKeystore() {
        let password = (<HTMLInputElement>document.getElementById('password')).value;
        let key = this.memory.getCurrentKey();
        let keystore = JSON.stringify(Binance.createKeystore(password, key));
        this.memory.setCurrentKeystore(keystore);
        this.memory.setPasswordHash(Binance.sha3(password));
    }

}