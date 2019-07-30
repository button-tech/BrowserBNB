import {Component, OnInit} from '@angular/core';
import {TemporaryService} from "../../../../services/temporary.service";
import {Location} from "@angular/common";
import {ClipboardService} from "../../../../services/clipboard.service";

@Component({
    selector: 'app-history-details',
    templateUrl: './history-details.component.html',
    styleUrls: ['./history-details.component.css']
})
export class HistoryDetailsComponent implements OnInit {
    copyMessage = 'Copy to clipboard';

    constructor(private temp: TemporaryService, private location: Location, private clipboardService: ClipboardService) {

    }

    ngOnInit() {

    }

    goBack() {
        this.location.back();
    }
    copyAddress() {
        this.clipboardService.copyToClipboard('d');
        this.copyMessage = 'Copied ✔';
        // // TODO: probable better to do that without observables, by just assiging address to MainComponent field
        // this.address$.pipe(
        //     takeUntil(timer(100)),
        //     take(1),
        // ).subscribe((address) => {
        //     this.clipboardService.copyToClipboard(address);
        //     this.copyMessage = 'Copied ✔';
        // });
    }
    toShortAddress(address) {
        return address.substring(0, 8) + '...' + address.substring(address.length - 8, address.length)
    }

    sum(a, b): string {
       return String((Number(a) + Number(b)).toFixed(8));
    }

}
