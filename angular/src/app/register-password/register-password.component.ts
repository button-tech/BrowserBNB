import {Component, OnInit} from '@angular/core';
import {MemoryService} from "../services/memory.service";
import * as Binance from '../../assets/binance/bnbSDK.js'

@Component({
    selector: 'app-password-creation',
    templateUrl: './register-password.component.html',
    styleUrls: ['./register-password.component.css']
})
export class RegisterPasswordComponent implements OnInit {

    private keystore;

    constructor(private memory: MemoryService) {
    }

    ngOnInit() {

    }

    setKeystore() {
        let password = (<HTMLInputElement>document.getElementById('password')).value;
        let key = this.memory.getCurrentKey();
        this.keystore = JSON.stringify(Binance.createKeystore(password, key));
    }

    saveKeystoreToMemory() {
        this.memory.setCurrentKeystore(this.keystore)
    }

}