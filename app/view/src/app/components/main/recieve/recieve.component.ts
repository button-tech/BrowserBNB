import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {map, take, takeUntil} from "rxjs/operators";
import {of, Subscription, timer} from "rxjs";
import {ClipboardService} from "../../../services/clipboard.service";
import {ChromeApiService} from "../../../services/chrome-api.service";

@Component({
    selector: 'app-recieve',
    templateUrl: './recieve.component.html',
    styleUrls: ['./recieve.component.css']
})
export class RecieveComponent implements OnInit {
    subscription: Subscription;
    address$ = of('bnb1hgm0p7khfk85zpz5v0j8wnej3a90w709vhkdfu');
    copyMessage = 'Copy to clipboard';
    myAngularxQrCode: string = null;

    constructor(private location: Location, private clipboardService: ClipboardService, private  chrome: ChromeApiService) {
        this.subscription = this.address$.pipe(
            map((address) => {
                this.myAngularxQrCode = address;
            })
        ).subscribe();
    }
    
    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    copyAddress() {
        // // TODO: probable better to do that without observables, by just assiging address to MainComponent field
        this.address$.pipe(
            takeUntil(timer(100)),
            take(1),
        ).subscribe((address) => {
            this.clipboardService.copyToClipboard(address);
            this.copyMessage = 'Copied ✔';
        });
    }

    openTab(address$: any, network: string) {
        let url;
        switch (network) {
            case 'mainnet':
                url = 'https://explorer.binance.org/address/';
                break;
            case 'testnet':
                url = 'https://testnet-explorer.binance.org/address/';
        }
        address$.pipe(
            map((address: any) => {
                this.chrome.openNewTab(`${url}${address}`)
            }),
            take(1)
        ).subscribe()
    }

    goBack() {
        this.location.back();
    }
}
