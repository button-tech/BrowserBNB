import {Component, OnInit} from '@angular/core';
import {TemporaryService} from "../../../../services/temporary.service";
import {Location} from "@angular/common";
import {ClipboardService} from "../../../../services/clipboard.service";
import {map, subscribeOn, take, takeUntil} from "rxjs/operators";
import {Observable, timer} from "rxjs";
import {ChromeApiService} from "../../../../services/chrome-api.service";
import {rawTokensImg} from "../../../../constants";

@Component({
    selector: 'app-history-details',
    templateUrl: './history-details.component.html',
    styleUrls: ['./history-details.component.css']
})
export class HistoryDetailsComponent implements OnInit {
    copyMessage = 'Copy to clipboard';

    constructor(public temp: TemporaryService, private location: Location, private clipboardService: ClipboardService, public chrome: ChromeApiService) {

    }

    openTab(txHash$: any, network: string) {
        let url;
        switch (network) {
            case 'mainnet':
                url = 'https://explorer.binance.org/tx/';
                break;
            case 'testnet':
                url = 'https://testnet-explorer.binance.org/tx/';
        }
        txHash$.pipe(
            map((transaction: any) => {
                this.chrome.openNewTab(`${url}${transaction.txHash}`)
            }),
            take(1)
        ).subscribe()
    }

    findMappedName(symbol$: any): Observable<string> {
        return symbol$.pipe(
            map((symbol: any) => {
                if (symbol.txAsset) {
                    const result = JSON.parse(rawTokensImg).find(o => o.symbol === symbol.txAsset);
                    return result.mappedAsset;
                }
                return symbol.txAsset
            }),
            take(1)
        )
    }


    ngOnInit() {

    }

    goBack() {
        this.location.back();
    }

    copyAddress(data, val) {
        // // TODO: probable better to do that without observables, by just assiging address to MainComponent field
        data.pipe(
            takeUntil(timer(100)),
            take(1),
        ).subscribe((address) => {
            let toCopy;
            switch (val) {
                case 'fromAddr':
                    toCopy = address.fromAddr;
                    break;
                case 'toAddr':
                    toCopy = address.toAddr;
                    break;
                case 'txHash':
                    toCopy = address.txHash;
                    break;
                case 'memo':
                    toCopy = address.memo;
                    break;
            }
            this.clipboardService.copyToClipboard(toCopy);
            this.copyMessage = 'Copied ✔';
        });
    }

    toShortAddress(address) {
        return address.substring(0, 8) + '...' + address.substring(address.length - 8, address.length)
    }

    sum(a, b): string {
        return String((Number(a) + Number(b)).toFixed(8));
    }

}
