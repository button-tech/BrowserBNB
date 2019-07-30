import {Component, OnInit, OnDestroy} from '@angular/core';
import {BinanceService} from "../../../services/binance.service";
import {StorageService} from "../../../services/storage.service";
import {Observable} from "rxjs";
import {Location} from "@angular/common";

@Component({
    selector: 'app-all-balances',
    templateUrl: './all-balances.component.html',
    styleUrls: ['./all-balances.component.css'],
})
export class AllBalancesComponent implements OnInit, OnDestroy {
    x: Observable<any>;

    constructor(private bncService: BinanceService, private storage: StorageService, private location: Location,) {

    }

    goBack() {
        this.location.back();
    }

    ngOnInit() {
        // TODO: real address
        this.x = this.bncService.getBalance('bnb1rgsk5024ej3tg77qahty0a2kav72mr702r349w', ' https://dex.binance.org/');
    }

    ngOnDestroy() {
    }

}