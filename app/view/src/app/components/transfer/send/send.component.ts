import {Component} from '@angular/core';
import {Location} from "@angular/common";
import {StorageService} from "../../../services/storage.service";
import {validateAddress} from "../../../services/binance-crypto";
import {Observable} from "rxjs";

@Component({
    selector: 'app-send',
    templateUrl: './send.component.html',
    styleUrls: ['./send.component.css']
})
export class SendComponent {

    isValidToNextPage: boolean;
    fee: Observable<number>;

    constructor(private location: Location, private storage: StorageService) {
    }


    goBack() {
        this.location.back();
    }

    // TODO: smb should call that
    checkTransactionStatus() {
       const {Symbol, Amount, AddressTo} = this.storage.currentTransaction;
       const networkPrefix = this.storage.selectedNetwork$.getValue().networkPrefix;
       if (Symbol && Amount >= 0 && validateAddress(AddressTo, networkPrefix)
       ) {
           this.isValidToNextPage = true;
       }
    }


}

