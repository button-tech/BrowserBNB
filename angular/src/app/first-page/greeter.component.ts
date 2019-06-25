import {Component, OnInit} from '@angular/core';
import {MemoryService} from "../services/memory.service";

// import * as Binance from '../../assets/binance/bnbSDK.js'
@Component({
    selector: 'app-greeter',
    templateUrl: './greeter.component.html',
    styleUrls: ['./greeter.component.css']
})
export class GreeterComponent implements OnInit {

    test: string;

    constructor(private memory: MemoryService) {
    }

    ngOnInit() {
        this.memory.currentAddress.subscribe(address=> this.test = address)
        // console.log(Binance.createMnemonic())
    }

    check() {
          this.memory.setCurrentAddress("9")
    }

}
