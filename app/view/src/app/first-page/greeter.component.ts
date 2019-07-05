import {Component, OnInit} from '@angular/core';
import {MemoryService} from '../services/memory.service';
import {Router} from "@angular/router";
import {StorageService} from "../services/storage.service";
import {BinanceCrypto, BinanceService} from "../services/binance.service";

@Component({
    selector: 'app-greeter',
    templateUrl: './greeter.component.html',
    styleUrls: ['./greeter.component.css']
})
export class GreeterComponent implements OnInit {

    constructor(public binance: BinanceService) {

      BinanceCrypto.createMnemonic();

    }


    ngOnInit() {

    }
}
