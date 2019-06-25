import {Component, OnInit, OnDestroy} from '@angular/core';
import {MemoryService} from "../services/memory.service";
import * as Binance from '../../assets/binance/bnbSDK.js'
import {BehaviorSubject, interval} from "rxjs";
import {forEach} from "@angular/router/src/utils/collection";

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
    address: string;
    shortAddress: string;
    balanceSubject = new BehaviorSubject('pending');
    balance: string = 'pending';
    $b = interval(4000).subscribe(x => this.getBalance());

    constructor(private memory: MemoryService) {
    }

    async getBalance() {

        Binance.getBalanceOfAddress(this.memory.getCurrentAddress()).then(x => {

            if (x.length == 0) {
                this.balanceSubject.next('0');
            } else {
                this.balanceSubject.next(this.findBNB(x));
            }
        }).catch(x => console.log(x));
    }


    ngOnInit() {
        this.memory.currentAddress.subscribe(address => this.address = address)
        this.shortAddress = this.address.substring(0, 5) + '...' + this.address.substring(this.address.length - 6, this.address.length);
        this.balanceSubject.asObservable().subscribe(balance => this.balance = balance);
        this.getBalance();
    }

    ngOnDestroy() {
        this.$b.unsubscribe();
        this.balanceSubject.unsubscribe();
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

    findBNB(list: any): string {
        for (let x of list) {
            if (x.symbol == "BNB") {
                return x.free;
            }
        }
    }

}
