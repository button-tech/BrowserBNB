import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {validateAddress} from '../../../../../services/binance-crypto';
import {FormControl} from "@angular/forms";
import {ITransaction, StateService} from "../../../../../services/state.service";


@Component({
    selector: 'app-address-input',
    templateUrl: './address-input.component.html',
    styleUrls: ['./address-input.component.css']
})
export class AddressInputComponent implements OnDestroy {

    isValid: boolean;
    touched: boolean;
    addressFormControl = new FormControl('', []);

    // @ts-ignore
    @ViewChild('addressElem') addressElem: ElementRef;

    constructor(private stateService: StateService) {
    }

    // TODO: remove all and make reactive forms
    validate() {
        const addressValue = (this.addressElem.nativeElement as HTMLInputElement).value;
        this.isValid = validateAddress(addressValue, this.stateService.selectedNetwork$.getValue().networkPrefix);

        if (this.isValid && addressValue !== '') {
            const newTx = this.stateService.currentTransaction.getValue();
            newTx.AddressTo = addressValue;
            this.stateService.currentTransaction.next(newTx);
        }
    }

    ngOnDestroy(): void {

    }
}

