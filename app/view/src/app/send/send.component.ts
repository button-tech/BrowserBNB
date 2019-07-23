import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";

@Component({
    selector: 'app-send',
    templateUrl: './send.component.html',
    styleUrls: ['./send.component.css']
})
export class SendComponent implements OnInit {



    constructor(private location: Location) {
    }


    goBack() {
        this.location.back();
    }


    ngOnInit() {

    }

}

