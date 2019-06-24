import {Component, OnInit} from '@angular/core';
import * as Binance from '../../assets/binance/bnbSDK.js'
import {MemoryService} from "../services/memory.service";

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

    mnemonic: string;

    constructor(private memory: MemoryService) {
        this.mnemonic = Binance.createMnemonic();
        let privateKey = Binance.getPvtKeyFromMnemonic(this.mnemonic);
        this.memory.setCurrentKey(privateKey);
        this.memory.setCurrentAddress(Binance.getAddressFromPrivateKey(privateKey))
    }

    ngOnInit() {
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

