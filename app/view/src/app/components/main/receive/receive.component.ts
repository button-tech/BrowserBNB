import {Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {map, take, takeUntil} from "rxjs/operators";
import {Observable, Subscription, timer} from "rxjs";
import {ClipboardService} from "../../../services/clipboard.service";
import {ChromeApiService} from "../../../services/chrome-api.service";
import {IUiState, StateService} from "../../../services/state.service";
import {BlockchainType} from "../../../services/storage.service";

@Component({
    selector: 'app-receive',
    templateUrl: './receive.component.html',
    styleUrls: ['./receive.component.css']
})
export class ReceiveComponent implements OnInit, OnDestroy {
    subscription: Subscription;
    address$: Observable<string>;
    copyMessage = 'Copy to clipboard';
    qrCode: string;
    network: string;

    constructor(public location: Location,
                public clipboardService: ClipboardService,
                public chrome: ChromeApiService,
                public stateService: StateService) {

        this.subscription = this.stateService.currentAddress$.pipe(
            map((address: string) => {
                console.log('address')
                console.log(address)

                    this.network = this.stateService.selectedNetwork$.getValue().label.toLocaleLowerCase();
                    this.qrCode = address;

                

            })).subscribe();
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    copyAddress(address: string) {
        this.clipboardService.copyToClipboard(address);
        this.copyMessage = 'Copied ✔';
    }

    openTab(address: string, blockchain: BlockchainType) {
        let url;
        if (blockchain === 'binance') {
            const prefix = this.network === 'testnet' ? 'testnet-' : '';
            url = `https://${prefix}explorer.binance.org/address/${address}`;
        } else {
            url = `https://www.mintscan.io/account/${address}`;
        }
        this.chrome.openNewTab(url);
    }

    goBack() {
        this.location.back();
    }
}
