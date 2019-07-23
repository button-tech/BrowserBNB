import { Component, OnInit } from '@angular/core';
import {Location} from "@angular/common";

@Component({
    selector: 'app-send',
    templateUrl: './send.component.html',
    styleUrls: ['./send.component.css']
})
export class SendComponent implements OnInit {

    tokens: string[] = [
        'BNB', 'KNC', 'INDEX'
    ];

    constructor(private location: Location) { }

    ngOnInit() {
    }

    goBack() {
        this.location.back();
    }

}

