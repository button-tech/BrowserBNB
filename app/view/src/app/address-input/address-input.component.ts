import {Component, OnInit} from '@angular/core';
import {validateAddress} from '../services/binance-crypto'

@Component({
    selector: 'app-address-input',
    templateUrl: './address-input.component.html',
    styleUrls: ['./address-input.component.css']
})
export class AddressInputComponent implements OnInit {

    currentAddress: string;

    constructor() {
    }

    ngOnInit() {
        this.currentAddress= (((document.getElementById('address') as HTMLInputElement).value) as unknown as string)
    }

    validate() {
        const address = (((document.getElementById('address') as HTMLInputElement).value) as unknown as string);
        if (validateAddress(address)) {
            document.getElementById('border').style.border = '1px solid #cbcbcb;';
        } else {
            (document.getElementById('border')as HTMLElement).style.border = '1 px solid rgb(207, 6, 6)';
        }
    }
}
