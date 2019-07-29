import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {take, takeUntil} from "rxjs/operators";
import {timer} from "rxjs";
import {ClipboardService} from "../../../services/clipboard.service";

@Component({
    selector: 'app-recieve',
    templateUrl: './recieve.component.html',
    styleUrls: ['./recieve.component.css']
})
export class RecieveComponent implements OnInit {

    copyMessage = 'Copy to clipboard';
    myAngularxQrCode: string = null;

    constructor(private location: Location, private clipboardService: ClipboardService,) {
        this.myAngularxQrCode = 'Your QR code data string';
    }


    ngOnInit() {
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

    goBack() {
        this.location.back();
    }
}
