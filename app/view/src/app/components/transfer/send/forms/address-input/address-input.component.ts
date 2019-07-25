import { Component, ElementRef, ViewChild } from '@angular/core';
import {validateAddress} from '../../../../../services/binance-crypto';
import {FormControl} from "@angular/forms";
import {StorageService} from "../../../../../services/storage.service";

@Component({
    selector: 'app-address-input',
    templateUrl: './address-input.component.html',
    styleUrls: ['./address-input.component.css']
})
export class AddressInputComponent {

    isValid: boolean;
    touched: boolean;
    addressFormControl = new FormControl('', []);

    // @ts-ignore
    @ViewChild('addressElem') addressElem: ElementRef;

    constructor(private storage: StorageService) {
    }

    validate() {
        const addressValue = (this.addressElem.nativeElement as HTMLInputElement).value;
        // TODO: give Solid name
        this.isValid = validateAddress(addressValue, this.storage.selectedNetwork$.getValue()
            .networkPrefix);

        this.storage.currentTransaction.AddressTo = addressValue;
    }
}
