import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {StorageService} from "../services/storage.service";
import {validateAddress} from "../services/binance-crypto";
import {Observable, timer} from "rxjs";
import {map} from "rxjs/operators";

@Component({
    selector: 'app-send',
    templateUrl: './send.component.html',
    styleUrls: ['./send.component.css']
})
export class SendComponent implements OnInit {

    isValidToNextPage: boolean;
    fee: Observable<number>;

    constructor(private location: Location, private storage: StorageService) {


    }


    goBack() {
        this.location.back();
    }


    ngOnInit() {

    }

    checkTransactionStatus() {
       const currentTx = this.storage.currentTransaction;
       if(currentTx.Symbol !== '' && validateAddress(currentTx.AddressTo) && currentTx.Amount >= 0) {
           this.isValidToNextPage = true;
       }
    }


}

