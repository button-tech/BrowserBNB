import { Component, ElementRef, ViewChild } from '@angular/core';
import {validateAddress} from '../services/binance-crypto';

@Component({
    selector: 'app-address-input',
    templateUrl: './address-input.component.html',
    styleUrls: ['./address-input.component.css']
})
export class AddressInputComponent {

    isValid: boolean;
    touched: boolean;

    // @ts-ignore
    @ViewChild('addressElem') addressElem: ElementRef;

    constructor() {
    }

    validate() {
        const addressValue = (this.addressElem.nativeElement as HTMLInputElement).value;
        // TODO: give Solid name
        this.isValid = validateAddress(addressValue);
    }
}
