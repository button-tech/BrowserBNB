import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";

@Component({
    selector: 'app-general',
    templateUrl: './general.component.html',
    styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {

    constructor(private location: Location) {
    }

    ngOnInit() {
    }

    goBack() {
        this.location.back();
    }
}
