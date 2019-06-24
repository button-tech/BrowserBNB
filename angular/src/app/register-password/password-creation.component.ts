import {Component, OnInit} from '@angular/core';
import {MemoryService} from "../services/memory.service";
import * as Binance from '../../assets/binance/bnbSDK.js'

@Component({
    selector: 'app-password-creation',
    templateUrl: './password-creation.component.html',
    styleUrls: ['./password-creation.component.css']
})
export class PasswordCreationComponent implements OnInit {

    private keystore;

    constructor(private memory: MemoryService) {
    }

    ngOnInit() {

    }

    setKeystore() {
        let password = document.getElementById("password").value;
        let key = this.memory.getCurrentKey();
        this.keystore = JSON.stringify(Binance.createKeystore(password, key));
    }

    saveKeystoreToMemory() {
        this.memory.setCurrentKeystore(this.keystore)
    }

}
